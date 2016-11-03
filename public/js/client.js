var socket;

function login() {
	if ($("input#name").val() != "") {
		$('.login').hide();
		setCookie("username", $("input#name").val());
		getPermission();
		chatInit();
	}
}

function logout() {
	$("input#name").val("");
	$('.login').show();
	setCookie("username", "");
}

function chatInit() {
	// WebSocket
	socket = io.connect();
	// neue Nachricht
	socket.on('chat', function (data) {
		var zeit = new Date(data.zeit);
		$('#content').append(
			$('<li></li>').append(
				// Uhrzeit
				$('<span>').text('[' +
					(zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours())
					+ ':' +
					(zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes())
					+ '] '
				),
				// Name
				$('<b>').text(typeof(data.name) != 'undefined' ? data.name + ': ' : ''),
				// Text
				$('<span>').text(data.text))
		);
		// nach unten scrollen
		$('body').scrollTop($('body')[0].scrollHeight);

		if (data.name != $("#name").val()) {
			if (data.name == undefined) {
				data.name = "Server";
			}
			showNotification(data.name, data.text)
		}
	});
	$('#senden').click(senden);
	$('#text').keypress(function (e) {
		if (e.which == 13) {
			senden();
		}
	});

	function senden() {
		if ($('#name').val() != "") {
			var name = $('#name').val();
			var text = $('#text').val();
			socket.emit('chat', { name: name, text: text });
			$('#text').val('');
		}
	}
}
