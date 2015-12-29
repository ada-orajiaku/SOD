/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 */

	var min=9;
	var max=26;

	var reset = $('div').css('fontSize');
	var elm = $('div.sod-content, p.ending');

	var size = str_replace(reset, 'px', '');

	function increaseFont(){
			if (size<=max) {
				size++;
				elm.css({'fontSize' : size});
			}
			return false;
		}

	function resetFont(){
			elm.css({'fontSize' : reset});
		}

	function decreaseFont(){
			if (size>=min) {
				size--;
				elm.css({'fontSize' : size});
			}
			return false;
		}






//A string replace function
function str_replace(haystack, needle, replacement) {
	var temp = haystack.split(needle);
	return temp.join(replacement);
}
