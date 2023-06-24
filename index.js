window.onload = () => {
	const slider_labels = document.getElementsByClassName("slider-label");
	const sliders = document.getElementsByClassName("slider");
	for (let i = 0; i < slider_labels.length; i++) {
		slider_labels[i].innerHTML = sliders[i].value;
		sliders[i].addEventListener('input', () => {
			let new_val = document.getElementById(sliders[i].id).value;
			document.getElementById(slider_labels[i].id).innerHTML = new_val;
		});
	}
}

document.getElementById("gen-button").addEventListener("click", () => {
	var canvas = document.createElement("canvas");
	canvas.width = 1500;
	canvas.height = 1500;
	var context = canvas.getContext("2d");
	var frequency = document.getElementById("frequency-slider").value;
	var amplitude = document.getElementById("amplitude-slider").value;
	var circle_num = document.getElementById("circle-slider").value;
	var warp_scale = document.getElementById("warp-slider").value;
	var warp_tessellate = document.getElementById("tessellate-slider").value;
	var circles_first = document.getElementById("circles-first").checked;
	console.log("circles_first:",circles_first);
	// Generate the trippy grid pattern
	for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
			let r = Math.sin(x * frequency) * amplitude;
			let g = Math.sin(y * frequency) * amplitude;
			let b = Math.sin((x + y)  * frequency) * amplitude;
			let color = 'rgb(' + Math.floor(r) + ', ' + Math.floor(g) + ', ' + Math.floor(b) + ')';
            context.fillStyle = color;
            context.fillRect(x, y, 1, 1);
		}
	}
	// Add fractal circles
    context.globalCompositeOperation = 'screen';
	if (circle_num > 0) {
		for (let i = 0; i < circle_num; i++) {
			let startX = Math.random() * canvas.width;
			let startY = Math.random() * canvas.height;
			let radius = Math.random() * 100 + 50;
			context.beginPath()
			context.arc(startX, startY, radius, 0, Math.PI*2, false);
			let r = (Math.random() * 255);
			let g = (Math.random() * 255);
			let b = (Math.random() * 255);
			let color = 'rgb(' + Math.floor(r) + ', ' + Math.floor(g) + ', ' + Math.floor(b) + ')';
			context.fillStyle = color;
			context.fill();
		}
	}
	// Apply warping
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	var data = imageData.data;
	for (let x = 0; x < canvas.width; x++) {
		for (let y = 0; y < canvas.height; y++) {
		    let offsetX = Math.sin(y / warp_tessellate) * warp_scale;
			let offsetY = Math.sin(x / warp_tessellate) * warp_scale;
			let sourceX = x + offsetX;
			var sourceY = y + offsetY;
			if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
				let destIndex = (y *  canvas.width + x) * 4;
				let sourceIndex = (Math.floor(sourceY) * canvas.width + Math.floor(sourceX)) * 4;
				data[destIndex] = data[sourceIndex]; // R
				data[destIndex + 1] = data[sourceIndex + 1]; // G
				data[destIndex + 2] = data[sourceIndex + 2]; // B
				data[destIndex + 3] = data[sourceIndex + 3]; // A
			}
		}
	}
	context.putImageData(imageData, 0, 0);
	var previewImg = document.getElementById("png-preview");
	previewImg.src = canvas.toDataURL("image/png");
	previewImg.style.display = "flex";
	var downloadLink = document.getElementById("download-link");
	downloadLink.href = canvas.toDataURL("image/png");
	downloadLink.download = "canvas.png"
	downloadLink.style.display = "block";
	downloadLink.style.color = "white";
});

function generateGrid(canv, ctx, freq, amp) {
	for (let x = 0; x < canv.width; x++) {
		for (let y = 0; y < canv.height; y++) {
			let r = Math.sin(x * freq) * amp;
			let g = Math.sin(y * freq) * amp;
			let b = Math.sin((x + y)  * freq) * amp;
			let color = 'rgb(' + Math.floor(r) + ', ' + Math.floor(g) + ', ' + Math.floor(b) + ')';
			ctx.fillStyle = color;
			ctx.fillRext(x, y, 1, 1);
		}
	}
}

function generateCircles(canv, ctx, circle_num) {
	ctx.globalCompositeOperation = "screen";
	if (circle_num > 0){
		for (let i = 0; i < circle_num; i++) {
			let startX = Math.random() * canv.width;
			let startY = Math.random() * canv.height;
			let radius = Math.random() * 100 + 50;
			ctx.beginPath();
			ctx.arc(startX, startY, radius, 0, Math.PI*2, false);
			let r = (Math.random() * 255);
			let g = (Math.random() * 255);
			let b = (Math.random() * 255);
			let color = 'rgb(' + Math.floor(r) + ', ' + Math.floor(g) + ', ' + Math.floor(b) + ')';
			ctx.fillStyle = color;
			ctx.fill();
		}
	}
}