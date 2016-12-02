$(document).ready(function() {
	if (hasCookie("color")) {
		changeColor( getCookie("color") );
	}

	$(".collorBtn").on("click", function() {
		changeColor($(this).attr("data-color"));
	});

	$("#fontColor").on("change", function() {
		changeCustomColor("font", $("#fontColor").val());
	});
	$("#bodyColor").on("change", function() {
		changeCustomColor("body", $("#bodyColor").val());
	});
});

function changeColor(color) {
	if (color != "") {
		$("body")
			.attr("class", "")
			.addClass(color);
		setCookie("color", color);
	}
}

function changeCustomColor(type, color) {
	if (type == "font")		var css = "color";
	else					var css = "background-color";

	$("body header").css(css, color);
	$("body footer").css(css, color);
	$("body .loginInput").css(css, color);

	$("body header .collorBtn").css("color", "#fff");
}