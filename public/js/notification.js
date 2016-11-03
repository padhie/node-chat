/**
 * Zeige Notification an
 */
function showNotification(title, text) {
	if (!("Notification" in window)) {
		// Browser unterstützt keine Notifikations
	}

	// Sende Notifikation
	else if (Notification.permission === "granted") {
		var notification = new Notification(title, {
			body: text
		});
	}
}

/**
 * Anfrage nach permission für Desktop-Notifikation
 */
function getPermission() {
	if (Notification.permission !== 'denied') {
		Notification.requestPermission();
	}
}