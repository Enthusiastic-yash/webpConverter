
const convertedImages = [];

function showLoading() {
    document.getElementById("loader").style.display = "block";
}

function hideLoading() {
    document.getElementById("loader").style.display = "none";
    document.querySelector(".hideBtn").style.display = "block";
    document.querySelector(".webBtn").classList.add("hideBtn");
}

function convertToWebP() {
    const inputElement = document.getElementById("imageInput");
    const files = inputElement.files;

    if (!files.length) {
        alert("Please select one or more image files.");
        return;
    }

    showLoading();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const webPDataUrl = canvas.toDataURL("image/webp");
                convertedImages.push({
                    dataUrl: webPDataUrl,
                    fileName: `converted_image_${i}.webp`,
                });

                if (convertedImages.length === files.length) {
                    // All images processed, hide loading
                    hideLoading();
                }
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

function downloadAll() {
    if (convertedImages.length === 0) {
        alert("No converted images to download.");
        return;
    }

    const zip = new JSZip();

    convertedImages.forEach((image, index) => {
        const { dataUrl, fileName } = image;
        const base64Data = dataUrl.split(",")[1];
        zip.file(fileName, base64Data, { base64: true });
    });

    zip
        .generateAsync({ type: "blob" })
        .then((blob) => {
            const zipFileName = "converted_images.zip";
            saveAs(blob, zipFileName);
            location.reload();
        })
        .catch((error) => console.error(error));
}
