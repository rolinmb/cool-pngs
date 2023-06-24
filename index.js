window.onload = () => {
	const input_labels = document.getElementsByClassName("text-input-label");
	const inputs = document.getElementsByClassName("text-input");
	for (let i = 0; i < input_labels.length; i++) {
		input_labels[i].innerHTML = inputs[i].value;
		inputs[i].addEventListener('input', () => {
			let new_val = document.getElementById(inputs[i].id).value;
			document.getElementById(input_labels[i].id).innerHTML = new_val;
		});
	}
}

document.getElementById("gen-button").addEventListener("click", () => {
	var canvas = document.createElement("canvas");
	canvas.width = 1500;
	canvas.height = 1500;
	var context = canvas.getContext("2d");
	var frequency = document.getElementById("frequency-text-input").value;
	if (frequency <= 0) {
		alert("Please enter a number for frequency greater than 0 and less than or equal to 1000.");
		return;
	}
	if (frequency > 1000) {
		alert("Please enter a number for frequency greater than 0 and less than or equal to 1000.");
		return;
	}
	var amplitude = document.getElementById("amplitude-text-input").value;
	if (amplitude <= 0) {
		alert("Please enter an amplitude greater than 0.");
		return;
	}
	if (amplitude > 1000) {
		alert("Please enter a number for amplitude greater than 0 and less than or equal to 1000.");
		return;
	}
	var circle_num = document.getElementById("circle-text-input").value;
	if (circle_num < 0) {
		alert("Please enter a positive integer for cirlce iterations greater than or equal to 0 and less than or equal to 500.");
		return;
	}
	if (!Number.isInteger(parseFloat(circle_num))) {
		alert("Please enter a positive integer number for circle generation iterations.");
		return;
	}
	if (circle_num > 500) {
		alert("Please enter a positive integer for cirlce iterations greater than or equal to 0 and less than or equal to 500.");
		return;
	}
	var warp_scale = document.getElementById("warp-text-input").value;
	if (warp_scale <= 0) {
		alert("Please enter a number for warp scaling greater than 0 and less than or equal to 1000.");
		return;
	}
	if (warp_scale > 1000) {
		alert("Please enter a number for warp scaling greater than 0 and less than or equal to 1000.");
		return;
	}
	var warp_tessellate = document.getElementById("tessellate-text-input").value;
	if (warp_tessellate <= 0) {
		alert("Please enter a number for warp tessellation greater than 0 and less than or equal to 1000.");
		return;
	}
	if (warp_tessellate > 1000) {
		alert("Please enter a number for warp tessellation greater than 0 and less than or equal to 1000.");
		return;
	}
	generateGrid(canvas, context, frequency, amplitude);
	generateCircles(canvas, context, circle_num);
	
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
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

function generateCircles(canv, ctx, circle_num) {
	ctx.globalCompositeOperation = 'screen';
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