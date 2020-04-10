/*
	ioBroker.vis teufelraumfeld Widget-Set

	version: "0.0.1"

	Copyright 2020 uha uha@slow-mo.de
*/
"use strict";

// add translations for edit mode
$.get( "adapter/teufelraumfeld/words.js", function(script) {
	let translation = script.substring(script.indexOf("{"), script.length);
	translation = translation.substring(0, translation.lastIndexOf(";"));
	$.extend(systemDictionary, JSON.parse(translation));
});

// this code can be placed directly in teufelraumfeld.html
vis.binds["teufelraumfeld"] = {
	version: "0.0.1",
	showVersion: function () {
		if (vis.binds["teufelraumfeld"].version) {
			console.log("Version teufelraumfeld: " + vis.binds["teufelraumfeld"].version);
			vis.binds["teufelraumfeld"].version = null;
		}
	},
	createWidget: function (widgetID, view, data, style) {
		var $div = $("#" + widgetID);
		// if nothing found => wait
		if (!$div.length) {
			return setTimeout(function () {
				vis.binds["teufelraumfeld"].createWidget(widgetID, view, data, style);
			}, 100);
		}

		var text = "";
		text += "OID: " + data.oid + "</div><br>";
		text += 'OID value: <span class="teufelraumfeld-value">' + vis.states[data.oid + ".val"] + "</span><br>";
		text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + "</span><br>";
		text += "extraAttr: " + data.extraAttr + "<br>";
		text += "Browser instance: " + vis.instance + "<br>";
		text += 'htmlText: <textarea readonly style="width:100%">' + (data.htmlText || "") + "</textarea><br>";

		$("#" + widgetID).html(text);

		// subscribe on updates of value
		function onChange(e, newVal, oldVal) {
			$div.find(".template-value").html(newVal);
		}
		if (data.oid) {
			vis.states.bind(data.oid + ".val", onChange);
			//remember bound state that vis can release if didnt needed
			$div.data("bound", [data.oid + ".val"]);
			//remember onchange handler to release bound states
			$div.data("bindHandler", onChange);
		}
	}
};

vis.binds["teufelraumfeld"].showVersion();