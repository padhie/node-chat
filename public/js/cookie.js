function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
		}
	}
	return "";
};

function hasCookie(cname) {
	if (getCookie(cname) != "") {
		return true;
	}
	return false;
};

function setCookie(cname, cvalue, exdays) {
	var expires = "";
	if (exdays != undefined) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		expires = "expires="+d.toUTCString();
	}
	document.cookie = cname + "=" + cvalue + "; " + expires;
};

function removeCookie(cname) {
	var nc = "";
	var ca = document.cookie.split(';');

	for(var i = 0; i <ca.length; i++) {
		var c = ca[i].trim();
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(cname) != 0) {
			if (nc != "") {
				nc += "; ";
			}
			nc += c;
		}
	}

	document.cookie = nc;
};