$(document).ready(function() {
	if (hasCookie("color")) {
		changeColor( getCookie("color") );
	}

	$(".collorBtn").on("click", function() {
		changeColor($(this).attr("data-color"));
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