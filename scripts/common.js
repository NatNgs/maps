const TO_DEG = 180 / Math.PI;

function xyzToLatlng(xyz, rot=0) {
	return [
		90 - (Math.acos(xyz[1] / mag(xyz))) * TO_DEG,
		((270 + (Math.atan2(xyz[0] , xyz[2])) * TO_DEG) % 360) -180,
		rot
	];
}
function latlngToXyz(lat, lng) {
	lat/=TO_DEG;
	lng/=TO_DEG;
	return [
		-Math.cos(lat) * Math.cos(lng),
		Math.sin(lat),
		Math.cos(lat) * Math.sin(lng),
	];
}

function redrawPath(p) {
	d3.select(this).selectAll('path').attr('d', d3.geo.path().projection(p));
}

function project(p) {
	const t = p.translate();
	d3.select(this).attr('width', 2 * t[0]).attr('height', 2 * t[1]);
}

function mag(p) {
	return Math.sqrt(p[0]*p[0]+p[1]*p[1]+p[2]*p[2]);
}

function m(n) {return (n+Math.PI*2)%(Math.PI*2); }
function getCurvedMiddlePoint(p1, p2, percent=0.5) {
	const polar1 = [
		m(Math.acos(p1[2])),
		m(Math.atan2(p1[1], p1[0]))
	];
	const polar2 = [
		m(Math.acos(p2[2])),
		m(Math.atan2(p2[1], p2[0]))
	];

	const polar3 = [0,0];
	for(let i=0; i<2; i++) {
		polar3[i] = m((polar1[i]*(1-percent)+polar2[i]*percent));
		// TODO fix problem on lng +/-180
	}

	const carth3 = [
		Math.sin(polar3[0])*Math.cos(polar3[1]),
		Math.sin(polar3[0])*Math.sin(polar3[1]),
		Math.cos(polar3[0]),
	];

	return carth3;
}

function saveSvg(svgContainerID, name) {
	const css = Array.prototype.map.call(document.getElementById('css').sheet.cssRules, (x)=>x.cssText).join('\n');
	const svgData = document.getElementById(svgContainerID).innerHTML.replace('>', '><style><![CDATA['+ css +']]></style>');
	const svgBlob = new Blob(['<?xml version="1.0" standalone="no"?>', svgData], {type:'image/svg+xml;charset=utf-8'});
	const downloadLink = document.createElement('a');
	downloadLink.href = URL.createObjectURL(svgBlob);
	downloadLink.download = name;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
