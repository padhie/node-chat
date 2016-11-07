var socket = null;
var modal = "<div class='modal' data-target='%TARGET%'>"+
				"<span class='close' onClick='closeModal(this);'>X</span>"+
				"<h2>%TARGET%</h2>"+
				"<ul class='contentWhisper'></ul>"+
				"<div class='inputbar'>"+
					"<input type='hidden' name='target' value='%TARGET%'>"+
					"<input type='text' name='message'>"+
					"<input type='button' class='btn' value='senden' onClick='sendPM(this);'>"+
				"</div>"+
			"</div>";

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

function appendChatContent(data) {
	var zeit = new Date(data.zeit);
	var name = "";
	if (typeof(data.name) != 'undefined') {
		name = "<span class='whisper' data-name='"+data.name+"'>"+data.name+"</span>: ";
	}
	var text = data.text;

	if (typeof data.whisper != undefined && data.whisper == 1) {
		name = "[whisper] "+name;
	}
	$('#content').append(
		$('<li></li>').append(
			// Uhrzeit
			$('<span>').text(
				'[' +
				(zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours())
				+ ':' +
				(zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes())
				+ '] '
			),
			// Name
			$('<b>').html(name),
			// Text
			$('<span>').text(text)
		)
	);
	// nach unten scrollen
	$('body').scrollTop($('body')[0].scrollHeight);
}

function addUser(user) {
	if ($("li[data-name="+user+"]").length == 0) {
		var row = '<li data-name="'+user+'">'+user+'</li>';
		$("#userlist").append(row);
		row=null;
	}
}

function removeUser(user) {
	$("li[data-name="+user+"]").remove();
}

function openModal(target) {
	var modalWindowContent = modal.replace(/%TARGET%/g, target);
	$("body").append(modalWindowContent);
	modalWindow = $("div.modal[data-target="+target+"]");
	modalWindow.draggable();
}

function closeModal(element) {
	$(element).parent().remove();
}

function incommingWhisper(data) {
	var zeit = "";
	var name = "";
	var text = "";

	var modalWindow = $("div.modal[data-target="+data.name+"]");
	if (modalWindow.length == 0) {
		openModal(data.name);
	}

	if (data.zeit != undefined) {
		zeit = new Date(data.zeit);
		zeit = '['+(zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours())+
			':'+(zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes())+
			'] ';
	}
	if (data.name != undefined) {
		name = data.name+": ";
	}
	if (data.text != undefined) {
		text = data.text;
	}

	modalWindow = $("div.modal[data-target="+data.name+"]");
	modalWindow.find(".contentWhisper").append(
		$('<li></li>').append(
			// Uhrzeit
			$('<span>').text(zeit),
			// Name
			$('<b>').html(name),
			// Text
			$('<span>').text(text)
		)
	);
}

function sendPM(element) {
	var modal = $(element).parent().parent();

	if (socket != null) {
		var name = $('#name').val();
		var target = $(modal).find("input[name=target]").val();
		var text = $(modal).find("input[name=message]").val();
		var data = {zeit:new Date(), name:name, text:text, target:target};

		socket.emit('chat', data);
		$(modal).find("input[name=message]").val("");
		setTimeout(function() {
			$(modal).find(".contentWhisper").scrollTop($(modal).find(".contentWhisper").prop("scrollHeight")+200);
		}, 500);
	}
}

function chatInit() {
	// WebSocket
	socket = io.connect();

	// neue Nachricht
	socket.on('chat', function (data) {
		if (typeof data.whisper != undefined && data.whisper == 1) {
			incommingWhisper(data);
		} else {
			appendChatContent(data);
		}

		if (data.name != $("#name").val()) {
			if (data.name == undefined) {
				data.name = "Server";
			}
			showNotification(data.name, data.text)
		}
	});

	// Serverstatusprüfung
	socket.on('status', function (data) {
		if (data.status == "PING") {
			var name = $('#name').val();
			socket.emit("status", {name:name, status:"PONG"});
		}
		if (data.status == "JOINED") {
			addUser(data.name);
			data.text = data.name+" join the chat.";
			delete data.name;
			appendChatContent(data);
		}
		if (data.status == "USERLIST") {
			for (var i=0; i<data.users.length; i++) {
				addUser(data.users[i]);
			}
		}
		if (data.status == "LEFT") {
			removeUser(data.name);
			data.text = data.name+" left the chat.";
			delete data.name;
			appendChatContent(data);
		}
	});

	// JOIN-Message an Server senden
	var name = $('#name').val();
	socket.emit('status', {zeit:new Date(), name:name, status:"JOIN"});

	// Event wenn nachricht gesendet werden soll
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
			var data = {zeit:new Date(), name:name, text:text};

			if ($("#whispertarget").html() != "") {
				data.target = $("#whispertarget").html();
				$("#whispertarget").html("");
			}

			socket.emit('chat', data);
			$('#text').val('');
		}
	}
}