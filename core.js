/**
* @file OpenROAD ECMAScript / JavaScript runtime
* @license Copyright(c) 2020 Actian Corporation
* @copyright
* This is an unpublished work containing confidential and proprietary
* information of Actian Corporation.  Use, disclosure, reproduction,
* or transfer of this work without the express written consent of
* Actian Corporation is prohibited.
*/

version = [1, 0, 1]

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

var local_XMLHttpRequest = null;
try {
    local_XMLHttpRequest = XMLHttpRequest;
}
catch(ReferenceError) {
    // Probably Node where XMLHttpRequest not available as a builtin
    local_XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  // https://www.npmjs.com/package/xmlhttprequest

    var local_url = null;
    try {
        local_url = url;
    }
    catch(ReferenceError) {
    	// Probably Node where url is not available as a builtin
        local_url = require("url");  // https://www.npmjs.com/package/url
    }

    var local_sync_request = null;
    try {
        local_sync_request = sync-request;
    }
    catch(ReferenceError) {
        // Probably Node where sync-request is not available as a builtin
        local_sync_request = require('sync-request');
    }

    var local_fs = null;
    try {
        local_fs = fs;
    }
    catch(ReferenceError) {
        // Probably Node where fs is not available as a builtin
        local_fs = require("fs");  // https://www.npmjs.com/package/fs
    }
}

//Errors
E_US100F_4111 = ['E_US100F_4111','Not a Number!'];
E_US1069_4201 = ['E_US1069_4201','Number is Infinity!'];
E_US1068_4200 = ['E_US1068_4200','Integer overflow!'];
E_JSunsafeInt = ['E_JSunsafeInt','Integer cannot be safely represented!'];
E_US1131_4401 = ['E_US1131_4401','Money overflow!'];
E_US10CE_4302 = ['E_US10CE_4302','Invalid Date!'];
E_US10D1_4305 = ['E_US10D1_4305','Invalid Day/Month!'];
E_US10D9_4313 = ['E_US10D9_4313','Date truncate only works on absolute dates!'];

E_US2535_9525_DECOVF_ERROR = ['E_US2535_9525_DECOVF_ERROR','Decimal overflow!'];
E_DECIMAL_PRECISION = ['E_DECIMAL_PRECISION','Precision must be between 1 and 39!'];
E_DECIMAL_SCALE = ['E_DECIMAL_SCALE','Scale cannnot be more than precision!'];

//Max, Min values
MIN_INT1 = -128;
MAX_INT1 = 127;
MIN_INT2 = -32768;
MAX_INT2 = 32767;
MIN_INT4 = -2147483648;
MAX_INT4 = 2147483647;
MIN_INT8 = -9223372036854775808;
MAX_INT8 = 9223372036854775807;
MIN_MONEY = -999999999999.99;
MAX_MONEY = 999999999999.99;

consoleError = error => console.log(new Date,error[0],cleanError(Error(error[1])));

function cleanError(e) {
	if (!e.stack) return e;
	var stack = e.stack.split('\n');
	
	if (typeof document === 'undefined') {
		var slash = require('path').sep || '/';
		var cwd = process.cwd() + slash;
	} else {
		var cwd = location.href.replace(/\/[^\/]*$/, '/');
	}

	function isInternal(line) {
		return (
			~line.indexOf('node_modules') ||
			~line.indexOf('core.js:') ||
			~line.indexOf('unittestframework.js:') ||
			~line.indexOf('(timers.js:') ||
			~line.indexOf('(events.js:') ||
			~line.indexOf('(node.js:') ||
			~line.indexOf('(module.js:') ||
			~line.indexOf('(domain.js:') ||
			~line.indexOf('(internal/modules/cjs/loader.js:') ||
			~line.indexOf('GeneratorFunctionPrototype.next (native)') ||
			false
		);
	}
	
	stack = stack.reduce(function (list, line) {		
		// Strip out node internals, other node modules, core.js and unittestframework.js
		if (isInternal(line)) return list;
		
		// remove absolute path
		line = line.replace(cwd, '');

		list.push(line);
		return list;
	}, []);

	e.stack = stack.join('\n');
	return e;
}

isDefined = value => typeof value !== 'undefined';
isNull = value => value === null;

isNaNInfinity = value => {
	if (isNaN(value)) {
		consoleError(E_US100F_4111); return null;	
	} else if (!isFinite(value)) {
		consoleError(E_US1069_4201); return null;	
	} else {
		return value;
	};
};

isIntegerOverflow = (testValue, minValue, maxValue) => {
	if (isNull(isNaNInfinity(testValue))) return null;
	if (typeof testValue === 'boolean') return testValue ? 1 : 0;
	let parsedInt = parseInt(testValue);
	if (parsedInt >= minValue && parsedInt <= maxValue) {
		if (Number.isSafeInteger(parsedInt)) {
			return parsedInt;
		} else {
			consoleError(E_JSunsafeInt); return null;
		};
	} else {
		consoleError(E_US1068_4200); return null;
	};
};

parseFloatNull = value => isNull(isNaNInfinity(value)) ? null : parseFloat(Number(value).toPrecision(15));

parseMoney = value => {
	if (isNull(value)) return null;
	let parsedString = String(value).replace(/[$]+/g,'');
	if (isNull(isNaNInfinity(parsedString))) return null;
	let parsedNumber = Number(parsedString);
	if (parsedNumber >= MIN_MONEY && parsedNumber <= MAX_MONEY) {
		return Number(parsedNumber.toFixed(2));
	} else {
		consoleError(E_US1131_4401); return null;
	};
};

const isEven = n => (n%2)==0;

const monthArr = ['','jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const secondUnits = ['second', 'seconds', 'sec', 'secs'];
const minuteUnits = ['minute', 'minutes', 'min', 'mins'];
const hourUnits = ['hour', 'hours', 'hr', 'hrs'];
const dayUnits = ['day', 'days'];
const weekUnits = ['week', 'weeks', 'wk', 'wks'];
const isoWeekUnits = ['iso-week', 'iso-wk'];
const monthUnits = ['month', 'months', 'mo', 'mos'];
const quarterUnits = ['quarter', 'quarters', 'qtr', 'qtrs'];
const yearUnits = ['year', 'years', 'yr', 'yrs'];

const intervalUnits = secondUnits.concat(minuteUnits, hourUnits, dayUnits, monthUnits, yearUnits);

function daysInMonth(m, y) {
    switch (m) {
        case 2 :
            return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
        case 9 : case 4 : case 6 : case 11 :
            return 30;
        default :
            return 31
    }
}

function isValidDate(d, m, y) {
    return m > 0 && m <= 12 && d > 0 && d <= daysInMonth(m, y);
}

parseDate = value => {
	if (isNull(value)) return null;
	if (value instanceof Date) {
		if (isFinite(value.getTime())) { 
			return value;
		} else {
			consoleError(E_US10CE_4302); return null;
		}
	} else {
		if (typeof value === 'string') {
			value = value.trim();
			if (value.indexOf(':') == -1) {
				this.isDateOnly = true;
			}
			else {
				this.isDateOnly = false;
			}
			var day = 0;
			var month = 0;
			var year = 0;
			var datetime = value.split(' ');
			var iso4tc = value.split('T');
			
			var totalMilliseconds = 0;
			this.isInterval = false;			
			if (datetime.length > 1 && isEven(datetime.length) && intervalUnits.includes(datetime[1].toLowerCase())) {
				for (var i = 0; i < datetime.length; i++) {
					if (isEven(i)) {
						if (datetime[i].indexOf(':') == -1) {
							if (isNaN(datetime[i])) {
								consoleError(E_US10CE_4302); return null;
							}
						} else {
							let hour = datetime[i].split(':');
							for (var j = 0; j < hour.length; j++) {
								if (isNaN(hour[i])) {
									consoleError(E_US10CE_4302); return null;
								}
							}
						}						
					} else {
						if (yearUnits.includes(datetime[i].toLowerCase())) {
							totalMilliseconds += datetime[i-1] * 31556952000;
						} else if (monthUnits.includes(datetime[i].toLowerCase())) {
							totalMilliseconds += datetime[i-1] * 2629746000;
						} else if (dayUnits.includes(datetime[i].toLowerCase())) {
							totalMilliseconds += datetime[i-1] * 86400000;
						} else if (secondUnits.includes(datetime[i].toLowerCase())) {
							totalMilliseconds += datetime[i-1] * 1000;
						} else if (minuteUnits.includes(datetime[i].toLowerCase())) {
							totalMilliseconds += datetime[i-1] * 60000;
						} else if (hourUnits.includes(datetime[i].toLowerCase())) {							
							if (datetime[i-1].indexOf(':') == -1) {
								totalMilliseconds += datetime[i-1] * 3600000;
							}
							else {
								let time = datetime[i-1].split(':');
								totalMilliseconds += time[0] * 3600000;
								totalMilliseconds += time[1] * 60000;
								if (time.length > 2) {
									totalMilliseconds += time[2] * 1000;
								}
							}
							
						}
					}
				}
				value = totalMilliseconds;
				this.isInterval = true;
			} 
			else if (value === 'now') {
				value = new Date().toString();
			}
			else if (value === 'today') {
				value = new Date().toDateString();
			}
			else if (value.charAt(2) === '-' && value.charAt(6) === '-') { //dd-mmm-yyyy
				day = Number(value.substring(0, 2));
				month = monthArr.indexOf(value.substring(3, 6).toLowerCase());
				year = Number(value.substring(7, 11));
			}
			else if ( (value.charAt(2) === '/' && value.charAt(5) === '/') //mm/dd/yy mm/dd/yyyy
				   || (value.charAt(2) === '-' && value.charAt(5) === '-') ){  //mm-dd-yyyy
				day = Number(value.substring(3, 5));
				month = Number(value.substring(0, 2));
				if (datetime[0].length === 8) {
					value = value.substring(0, 6) + '20' + value.substring(6);
				}
				year = Number(value.substring(6,10));
			}
			else if (value.charAt(4) === '-' && value.charAt(7) === '-') { //yyyy-mm-dd
				day = Number(value.substring(8, 10));
				month = Number(value.substring(5, 7));
				year = Number(value.substring(0, 4));
				if ( this.isDateOnly === true ) {
					value = value.substring(0, 10) + ' 00:00:00' + value.substring(10);
				}
			}
			else if (value.charAt(4) === '.' && value.charAt(7) === '.') { //yyyy.mm.dd
				day = Number(value.substring(8, 10));
				month = Number(value.substring(5, 7));
				year = Number(value.substring(0, 4));
			}
			else if (value.charAt(4) === '_' && value.charAt(7) === '_') { //yyyy_mm_dd
				day = Number(value.substring(8, 10));
				month = Number(value.substring(5, 7));
				year = Number(value.substring(0, 4));
				value = value.substring(0, 4) + '.' + value.substring(5, 7) + '.' + value.substring(8);
			}
			else if (value.charAt(2) === '/' || value.charAt(2) === '-') { //mm/dd mm-dd
				if (datetime[0].length === 5) {
					day = Number(value.substring(3, 5));
					month = Number(value.substring(0, 2));
					year = new Date().getFullYear();
					value = value.substring(0, 5) + value.charAt(2) + String(year) + value.substring(5);
				}
			}
			else if (datetime[0].length === 6 && isFinite(Number(datetime[0]))) { //mmddyy
				day = Number(value.substring(2, 4));
				month = Number(value.substring(0, 2));
				year = Number('20' + value.substring(4, 6));
				value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/20' + value.substring(4);
			}
			else if (value.charAt(2) === ':') { //hh:mm[:ss]
				value = (new Date().toDateString()) + ' ' + value;
			}
			else if ( (datetime[0].length === 8 && isFinite(Number(datetime[0])) )
					|| (iso4tc[0].length === 8 && isFinite(Number(iso4tc[0]))) ) { //yyyymmdd
				if (iso4tc.length > 1) {
					if (iso4tc[1].length === 6 && isFinite(Number(iso4tc[1]))) {
						value = value.substring(0, 11) + ':' + value.substring(11, 13) + ':' + value.substring(13);
						this.isDateOnly = false;
					}
				}
				day = Number(value.substring(6, 8));
				month = Number(value.substring(4, 6));
				year = Number(value.substring(0, 4));
				value = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6);
				if ( this.isDateOnly === true ) {
					value = value.substring(0, 10) + ' 00:00:00' + value.substring(10);
				}
			}
			else if (value.charAt(2) === '.' && value.charAt(5) === '.') { //dd.mm.yyyy
				day = Number(value.substring(0, 2));
				month = Number(value.substring(3, 5));
				year = Number(value.substring(6,10));
				value = value.substring(3, 5) + '/' + value.substring(0, 2) + '/' +value.substring(6);
			}
			else if (value.charAt(4) === '-' && value.charAt(8) === '-') { //yyyy-mmm-dd
				year = Number(value.substring(0, 4));
				month = monthArr.indexOf(value.substring(5, 8).toLowerCase());
				day = Number(value.substring(9, 11));
				value = value.substring(9, 11) + '-' + value.substring(5, 8) + '-' + value.substring(0, 4) + value.substring(11);
			}
			else if (value.charAt(3) === '-' && value.charAt(6) === '-') { //mmm-dd-yyyy
				day = Number(value.substring(4, 6));
				month = monthArr.indexOf(value.substring(0, 3).toLowerCase());
				year = Number(value.substring(7, 11));
				value = value.substring(4, 6) + '-' + value.substring(0, 3) + value.substring(6);
			}
		
			if (isNaN(day) || isNaN(month) || isNaN(year)) {
				consoleError(E_US10CE_4302); return null;
			} else if ( day > 0 ) {
				if (!isValidDate(day, month, year)) {
					consoleError(E_US10D1_4305); return null;
				}
			}
		}		
		let parsedDate = new Date(value);
		if (isFinite(parsedDate.getTime())) {
			return parsedDate;
		} else {
			consoleError(E_US10CE_4302); return null;
		}
	}
};

parseDecimal = (value, precision = 39, scale = 0) => {
	if (isNull(isNaNInfinity(value))) return null;
	if ( precision < 1 || precision > 39 ) {
		consoleError(E_DECIMAL_PRECISION); return null;
	};
	if ( scale > precision) {
		consoleError(E_DECIMAL_SCALE); return null;
	};
	let numArray = String(value).split('.');
	let integerPart = numArray[0];
    if ((value > 0 && integerPart.length > (precision - scale)) ||
        (value < 0 && integerPart.length > (precision - scale + 1))) {
		consoleError(E_US2535_9525_DECOVF_ERROR); return null;
	};
	if (scale == 0) return Number(integerPart);
	let decimalPart = numArray[1] || '';
	if (decimalPart.length > scale) return Number(`${integerPart}.${decimalPart.substr(0,scale)}`); // Truncate
	while (decimalPart.length < scale) decimalPart += '0'; // Append zeros
	return Number(`${integerPart}.${decimalPart}`);	
};


//character codes for printable characters
hc_doublequote = '"';
hc_quote = "'";
hc_space = ' ';

//character codes for non-printable characters
hc_formfeed = '\f';
hc_newline = '\n';
hc_tab = '\t';

//error codes
er_ok = 0;
er_fail = 1;
er_outofrange = 12386307;
er_rownotfound = 12386308;
er_keynotfound = 12386532;
er_nameexists = 12517428;

//message types
mt_none = '';
mt_info = 'Information: ';
mt_warning = 'Warning: ';
mt_error = 'Error: ';

//Pop-up Reply Codes
pu_cancel = 0;
pu_ok = 1;

//curexec.trace
curexec = { trace: param => console.log(param.string ? param.string.value : isDefined(param.text) ? param.text : param),
    infopopup: param => isDefined(param.messagetype) ? alert(param.messagetype + param.messagetext) : alert('Information: ' + param.messagetext),
    confirmpopup: param => confirm('Confirmation: ' + param.messagetext),
    replypopup:  param => 1 //TODO
};

/**
 * @function ifnull
 * @param param1 - value to be checked with null
 * @param param2 - a substitute value in case param1 is null
 * @description If param1 is not null then ifnull returns param1. If param1 is null, Infinity or NaN then ifnull returns param2.
 */
ifnull = (param1,param2) => (isNull(param1) || (typeof param1 === 'number' && !isFinite(param1))) ? param2 : param1;

//Data Type Conversion Functions
c = param => String(param);
char = param => String(param);
varchar = param => String(param);
nvarchar = param => String(param);
text = param => String(param);

/**
 * @function float4
 * @param {*} param - value to be converted to float4
 * @description Converts param to float4. NOTE: OpenROAD float4 is truncated after the precision digits, whereas in JavaScript number is rounded.
 * @returns {number|null} a null or a floating point number with 8 digit precision
 * @throws an error if param is NaN or Infinity.
 */
float4 = param => isNull(isNaNInfinity(param)) ? null : parseFloat(Number(param).toPrecision(8));

/**
 * @function float8
 * @param {*} param - value to be converted to float8
 * @description Converts param to float8
 * @returns {number|null} a null or a floating point number with 15 digit precision
 * @throws an error if param is NaN or Infinity.
 */
float8 = param => parseFloatNull(param);

/**
 * @function int1
 * @param {*} param - value to be converted to integer1
 * @description Converts param to integer1 aka tinyint
 * @returns {number|null} a null or an integer within range of (-128 to 127)
 * @throws an error if param is NaN, Infinity or out of range for integer1.
 */
int1 = param => isIntegerOverflow(param,MIN_INT1,MAX_INT1);

/**
 * @function int2
 * @param {*} param - value to be converted to integer2
 * @description Converts param to integer2 aka smallint
 * @returns {number|null} a null or an integer within range of (-32768 to 32767)
 * @throws an error if param is NaN, Infinity or out of range for integer2.
 */
int2 = param => isIntegerOverflow(param,MIN_INT2,MAX_INT2);

/**
 * @function int4
 * @param {*} param - value to be converted to integer4
 * @description Converts param to integer4 aka integer
 * @returns {number|null} a null or an integer within range of (-2147483648 to 2147483647)
 * @throws an error if param is NaN, Infinity or out of range for integer4.
 */
int = param => isIntegerOverflow(param,MIN_INT4,MAX_INT4);

/**
 * @function int8
 * @param {*} param - value to be converted to integer8
 * @description Converts param to integer8 aka bigint. NOTE: OpenROAD integer8 range(-9223372036854775808 to 9223372036854775807) is more than JavaScript safe integer range(-9007199254740991 to 9007199254740991).
 * @returns {number|null} a null or an integer within range of (-9007199254740991 to 9007199254740991)  
 * @throws an error if param is NaN, Infinity, not a safe Integer or out of range for integer8.
 */
bigint = param => isIntegerOverflow(param,MIN_INT8,MAX_INT8);

money = param => parseMoney(param);

//Date Functions
date = param => parseDate(param);
ingresdate = param => parseDate(param);

const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
	'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const weekdayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 
	'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
function padZero(num) { 
	return num < 10 ? '0' + num : num;
}
to_char = (param1,param2) => {
	let date_val = parseDate(param1);
	if (date_val === null) {
		return null;
	}
	else {
		if (isDefined(param2)) {
			let day = date_val.getDate(),
				month = date_val.getMonth(),
				year = date_val.getFullYear(),
				hour = date_val.getHours(),
				minute = date_val.getMinutes(),
				second = date_val.getSeconds(),
				HH12 = padZero(hour % 12),
				HH24 = padZero(hour),
				MI = padZero(minute),
				SS = padZero(second),
				PM = hour < 12 ? 'AM' : 'PM',
				DAY = weekdayNames[date_val.getDay()],
				DY = DAY.substr(0, 3),
				DD = padZero(day),
				MM = padZero(month + 1),
				MONTH = monthNames[month],
				MON = MONTH.substring(0, 3),
				YYYY = String(year),
				YY = YYYY.substring(2, 4);
			if (param2.indexOf('MON') > -1) {
				param2 = param2.replace('MONTH', MONTH).replace('MON', MON);
			}
			else {
				param2 = param2.replace('MM', MM);
			}
			return param2.replace('HH12', HH12).replace('HH24', HH24).replace('HH', HH12)
				.replace('MI', MI).replace('SS', SS).replace('DD', DD)
				.replace('DAY', DAY).replace('DY', DY)
				.replace('YYYY', YYYY).replace('YY', YY)
				.replace('AM', PM).replace('PM', PM);
		} else {
			return date_val.toString();
		}
	}
}
year = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if (this.isInterval == true) {
			return date_val.getUTCFullYear();
		} else {
			return date_val.getFullYear();
		}
	}
}
month = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if (this.isInterval == true) {
			return date_val.getUTCMonth() + 1;
		} else {
			return date_val.getMonth() + 1;
		}
	}		
}
quarter = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if (this.isInterval == true) {
			return Math.floor((date_val.getUTCMonth() / 3)) + 1;
		} else {
			return Math.floor((date_val.getMonth() / 3)) + 1;
		}
	}
}
week = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		let weekday = (0 == date_val.getDay()) ? 7 : date_val.getDay();
		return Math.floor( ( ((date_val.getTime() - (new Date(date_val.getFullYear(),0,1)).getTime()) / 86400000) - weekday + 8) / 7 );
	}
}
week_iso = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		let d = new Date(Date.UTC(date_val.getFullYear(), date_val.getMonth(), date_val.getDate()));
		let dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
		return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
	}
}
day = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if (this.isInterval == true) {
			return date_val.getUTCDate();
		} else {
			return date_val.getDate();
		}
	}	
}
dayofmonth = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if (this.isInterval == true) {
			return date_val.getUTCDate();
		} else {
			return date_val.getDate();
		}
	}		
}
hour = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if (this.isInterval == true) {
			return date_val.getUTCHours();
		} else {
			return date_val.getHours();
		}
	}
}
minute = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if (this.isInterval == true) {
			return date_val.getUTCMinutes();
		} else {
			return date_val.getMinutes();
		}
	}		
}
second = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if (this.isInterval == true) {
			return date_val.getUTCSeconds();
		} else {
			return date_val.getSeconds();
		}
	}
}
dayofweek = (param1,param2) => {
	let date_val = parseDate(param1);
	if (date_val === null)
		return null;
	else
		return isDefined(param2) ? date_val.getDay() + param2 : date_val.getDay() + 1;
}
dayofyear = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		let start = new Date(date_val.getFullYear(), 0, 0);
		return Math.floor(((date_val - start) + ((start.getTimezoneOffset() - date_val.getTimezoneOffset()) * 60000)) / 86400000);
	}
}
dow = param => {
	let date_val = parseDate(param);
	if (date_val === null)
		return null;
	else
		return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][ date_val.getDay() ];
}
millisecond = param => 0;
microsecond = param => 0;
nanosecond = param => 0;
date_trunc = (param1,param2) => {
	if (this.isInterval == true) {
		consoleError(E_US10D9_4313); return null;
	}
	if (yearUnits.includes(param1.toLowerCase())) {
		return new Date(year(param2),0);
	} else if (monthUnits.includes(param1.toLowerCase())) {
		return new Date(year(param2),month(param2)-1);
	} else if (quarterUnits.includes(param1.toLowerCase())) {
		let mon = month(param2) - 1;
		return new Date(year(param2),mon-(mon%3));
	} else if (weekUnits.includes(param1.toLowerCase()) || isoWeekUnits.includes(param1.toLowerCase())) {
		let date_val = parseDate(param2);
		if (date_val === null) {
			return null;
		}
		else {
			let weekday = date_val.getDay();
			let monday = date_val.getDate() - weekday + (weekday == 0 ? -6 : 1);
			return new Date(date_val.getFullYear(),date_val.getMonth(),monday);
		}
	} else if (dayUnits.includes(param1.toLowerCase())) {
		return new Date(year(param2),month(param2)-1,day(param2));
	} else if (secondUnits.includes(param1.toLowerCase())) {
		return new Date(year(param2),month(param2)-1,day(param2),hour(param2),minute(param2),second(param2));
	} else if (minuteUnits.includes(param1.toLowerCase())) {
		return new Date(year(param2),month(param2)-1,day(param2),hour(param2),minute(param2));
	} else if (hourUnits.includes(param1.toLowerCase())) {
		return new Date(year(param2),month(param2)-1,day(param2),hour(param2));
	}
}
date_part = (param1,param2) => {
	if (yearUnits.includes(param1.toLowerCase())) {
		return year(param2);
	} else if (monthUnits.includes(param1.toLowerCase())) {
		return month(param2);
	} else if (quarterUnits.includes(param1.toLowerCase())) {
		return quarter(param2);
	} else if (weekUnits.includes(param1.toLowerCase())) {
		return week(param2);
	} else if (isoWeekUnits.includes(param1.toLowerCase())) {
		return week_iso(param2);
	} else if (dayUnits.includes(param1.toLowerCase())) {
		return day(param2);
	} else if (secondUnits.includes(param1.toLowerCase())) {
		return second(param2);
	} else if (minuteUnits.includes(param1.toLowerCase())) {
		return minute(param2);
	} else if (hourUnits.includes(param1.toLowerCase())) {
		return hour(param2);
	}
}
date_gmt = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		if ( this.isDateOnly == true ) {
			let dateArr = date_val.toDateString().split(' ');
			let month = monthArr.indexOf(dateArr[1].toLowerCase());
			return dateArr[3] + '_' + padZero(month) + '_' + dateArr[2] + ' 00:00:00 GMT';
		} else {
			let dateArr = date_val.toUTCString().split(' ');
			let month = monthArr.indexOf(dateArr[2].toLowerCase());
			return dateArr[3] + '_' + padZero(month) + '_' + dateArr[1] + ' ' + dateArr[4] + ' GMT';
		}
	}
}
gmt_timestamp = param => {
	let dateArr = new Date(param * 1000).toUTCString().split(' ');
	let month = monthArr.indexOf(dateArr[2].toLowerCase());
	return dateArr[3] + '_' + padZero(month) + '_' + dateArr[1] + ' ' + dateArr[4] + ' GMT';
}
interval = (param1,param2) => {
	let duration = parseDate(param2);
	if (duration === null) {
		return null;
	}
	else {
		if (yearUnits.includes(param1.toLowerCase())) {
			return duration / 31556952000;
		} else if (monthUnits.includes(param1.toLowerCase())) {
			return duration / 2629746000;
		} else if (quarterUnits.includes(param1.toLowerCase())) {
			return duration / 7889238000;
		} else if (weekUnits.includes(param1.toLowerCase())) {
			return duration / 604800000;
		} else if (dayUnits.includes(param1.toLowerCase())) {
			return duration / 86400000;
		} else if (secondUnits.includes(param1.toLowerCase())) {
			return duration / 1000;
		} else if (minuteUnits.includes(param1.toLowerCase())) {
			return duration / 60000;
		} else if (hourUnits.includes(param1.toLowerCase())) {
			return duration / 3600000;
		}
	}
}
isdst = param => {
	let date_val = parseDate(param);
	if (date_val === null) {
		return null;
	}
	else {
		let jan = new Date(date_val.getFullYear(), 0, 1).getTimezoneOffset();
		let jul = new Date(date_val.getFullYear(), 6, 1).getTimezoneOffset();
		return Math.max(jan, jul) != date_val.getTimezoneOffset();
	}
}
_date = param => {
	let dateArr = new Date(param * 1000).toDateString().split(' ');
	let day = dateArr[2].substring(0,1) == '0' ? ' ' + dateArr[2].substring(1) : dateArr[2];
	return day + '-' + dateArr[1].toLowerCase() + '-' + dateArr[3].substring(2);
}
_date4 = param => {
	let dateArr = new Date(param * 1000).toDateString().split(' ');
	return dateArr[2] + '-' + dateArr[1].toLowerCase() + '-' + dateArr[3];
}
_time = param => {
	return new Date(param * 1000).toTimeString().substring(0, 5);
}

decimal = (param,precision,scale) => parseDecimal(param,precision,scale);

iihexint = param => parseInt(param, 16);
hex = param => (typeof param === 'number') ? param.toString(16) : [...param].reduce(((result, ch) => result += ch.codePointAt(0).toString(16)), '');
unhex = param => (typeof param === 'number') ? parseInt(param, 16) : param.match(/..?/g).reduce(((result, ch2) => result += String.fromCodePoint(parseInt(ch2, 16))), '');

//Numeric Functions
abs = param => Math.abs(param);
acos = param => Math.acos(param);
asin = param => Math.asin(param);
atan = param => Math.atan(param);
atan2 = (param1,param2) => Math.atan2(param1,param2);
ceil = param => Math.ceil(param);
ceiling = param => Math.ceil(param);
cos = param => Math.cos(param);
exp = param => Math.exp(param);
floor = param => Math.floor(param);
ln = param => Math.log(param);
mod = (param1,param2) => param1 % param2;
pi = () => Math.PI;
round = (param1,param2) => Math.round(param1 * Math.pow(10, param2)) / Math.pow(10, param2);
shift = (param1,param2) => param2==0 ? param1 : param2<0 ? param1.substr(-param2) : ' '.repeat(param2)+param1.substr(0, param1.length-param2);
sign = param => Math.sign(param);
sin = param => Math.sin(param);
sqrt = param => Math.sqrt(param);
tan = param => Math.tan(param);
trunc = (param1,param2) => Math.trunc(param1 * Math.pow(10, param2)) / Math.pow(10, param2);

//Random Number Functions
/**
 * @function rand
 * @param {number} [seed] - optional integer parameter used as a seed for random number generator
 * @description If seed is provided Knuth's random number generator used in OpenROAD is called, else Math.random() is used. Random value from seed is calculated as : 
 * M = 2147483648.0 (2^31); A = 21474837.0; C = 1.0; random_number = ((A * seed + C) % M) / M;
 * @returns {number} a random float between 0.0 and 1.0.
 */
rand = (seed) => isDefined(seed) ? ((seed * 21474837 + 1) % 0x80000000) / 0x80000000 : Math.random();

/**
 * @function random
 * @param {number} [min] - minimum value of random number range
 * @param {number} [max] - maximum value of random number range
 * @description When the range is not provided, a number is generated between 0 and 16777216 (2^24 same as OpenROAD)
 * @returns {number} a random integer within the specified range
 */
random = (min, max) => {
	min = isDefined(min) ? Math.ceil(min) : 0;
	max = isDefined(max) ? Math.floor(max) : 0x1000000;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @function randomf
 * @param {number} [min] - minimum value of random number range
 * @param {number} [max] - maximum value of random number range
 * @description Passing two integer values generates an integer result within the specified range; passing two floats generates a float within the specified range; passing an int and a float causes them to be coerced to an int and generates an integer result within the specified range (that is, min <= x <= max). When nothing is passed call Math.random().
 * @returns {number} a random integer or float within the specified range
 */
randomf = (min, max) => {
	if (isDefined(min) && isDefined(max)) {
		if (Number.isInteger(min) || Number.isInteger(max)){
			return random(min,max);
		} else {
			return Math.random() * (max - min) + min;
		}
	} else {
		return Math.random();
	}
}

//String Functions
ascii = param => String(param).codePointAt(0);
chr = param => String.fromCodePoint(param);
charextract = (param1,param2) => String(param1).charAt(param2-1);
concat = (param1,param2) => String(param1).concat(param2);
initcap = param => String(param).toLowerCase().split(' ').map(word=>word[0].toUpperCase()+word.slice(1)).join(' ');
character_length = param => String(param).length;
length = param => String(param).length;
left = (param1,param2) => String(param1).substring(0,param2);
right = (param1,param2) => String(param1).substring(param1.length - param2);
substr = (param1,param2,param3) => String(param1).substr(param2-1,param3);
lower = param => String(param).toLowerCase();
lowercase = param => String(param).toLowerCase();
locate = (param1,param2) => String(param1).indexOf(param2) === -1 ? String(param1).length+1 : String(param1).indexOf(param2)+1;
lpad = (param1,param2,param3) => (param2 > String(param1).length) ? String(param1).padStart(param2,param3) : String(param1).substring(0, param2);
rpad = (param1,param2,param3) => (param2 > String(param1).length) ? String(param1).padEnd(param2,param3) : String(param1).substring(0, param2);
squeeze = param => String(param).trim().replace(/\s+/g, ' ');
ltrim = param => String(param).replace(/^\s+/g, '');
rtrim = param => String(param).replace(/\s+$/g, '');
trim = param => String(param).replace(/\s+$/g, '');
upper = param => String(param).toUpperCase();
uppercase = param => String(param).toUpperCase();

IIByRef = class IIByRef {
    constructor(name, value, datatype, objtype) {
        this.name = name;
        this.value = value;
        this.datatype = datatype;
        this.objtype = objtype;
        this.byrefarray = new Array();
    }
}

IIArray = class extends Array {

    constructor(type_decl) {
        super(...arguments);
        this.type_decl = type_decl;
        this.firstrow = 0;
        this.lastrow = 0;
        this.allrows = 0;
        this.length = 0;
    }

    /*
    ** Access an array using OpenROAD IL index semantics
    **
    ** If the array index used has an undefined value
    ** then the array entry does not exist.  If this is the
    ** case, and the autorow parameter is set to true, a new
    ** row will be created and returned.  If autorow is set
    ** to false, no new record will be created and this function
    ** will return an undefined value (with OpenROAD 4GL a null
    ** value is returned)
    */
    arrayindexaccess({ index, srcclass, autorow }) {
     
        if (index < 1) {
            throw 'Row ' + varchar(index + 1) + ' is out of range for an array access';  
        }

        index = index - 1;   // JS arrays are zero-based      
        if ((index >= this.length && autorow == false && this.length != 0 ) ||
            (index >= this.length + 1 && autorow == true)) {
            throw 'Row ' + varchar(index + 1) + ' is out of range for an array access';
        }

        var val = this[index];

        if (autorow === true) {

            if (val == undefined && (srcclass == null || srcclass == undefined || !(srcclass instanceof this.type_decl))) {

                if (this.type_decl != null) {
                    /*
                    ** this.type_decl should have already been set
                    ** by the class constructor create a new one
                    */
                    srcclass = new this.type_decl;
                }
            }

            if (srcclass !== null && srcclass !== undefined) {
                if (val === undefined) {
                    if (this.length === 0) {
                        this.push(srcclass)  // Insert at top
                    }
                    else {
                        this.splice(index, 0, srcclass); // Insert within
                    }
                }
                else if (srcclass != val && srcclass instanceof this.type_decl) {
                    this[index] = srcclass;   // Replace object
                }
            }
        }

        this.firstrow = 1;
        this.lastrow = this.allrows = this.length;

        return this[index];
    }

    /*
    ** Remove a row from an array using the rownumber
    ** passed.  If the rownumber does not correspond to
    ** valid array entry, return er_rownotfound.  Otherwise
    ** remove the row and return er_ok.
    */
    removerow({ rownumber }) {
        var idx = rownumber - 1;
        var val = this[idx];
        if (val === null || val === undefined) {
            return er_rownotfound;
        }
        else {
            this.splice(idx, 1);

            if (this.length > 0) {
                this.firstrow = 1;
            }
            else {
                this.firstrow = 0;
            }

            this.lastrow = this.allrows = this.length;

            return er_ok;
        }
    }

    /*
    ** InsertRow Method
    ** The InsertRow method inserts a row into the array at the specified row number.
    ** This method has the following syntax:
    **      integer = ArrayObject.InsertRow({rownumber = integer, rowobject = Object})
    ** This method has the following parameters:
    **  rownumber
    **      Specifies the row number for the new row. You can insert a row at the beginning
    **      of the array (rownumber = 1), anywhere in the middle of the array, or at the end
    **      of the array (rownumber = array.length + 1). If you specify a rownumber larger
    **      than this, it will default to array.Length + 1.
    **      Default: 1
    **      When you insert a row it renumbers the rows after the inserted row.
    **      For example, if you insert a new row at row 10, it creates a new row 10, the
    **      previous row 10 becomes row 11, 11 becomes 12, and so on.
    **  rowobject
    **      Specifies the object that the new array row is to reference.
    **      If you do not specify an object, it inserts a default object of the type
    **      specified used by existing row 0.  If the array is empty the function returns
    **      er_fail
    */
    insertrow({ rownumber = 1, rowobject = null }) {
        var idx = rownumber - 1;
        var numrows = this.length;
        var do_push = false;

        if (idx < 0) {
            return er_rowoutofrange;
        }
        else if (idx > numrows + 1) {
            idx = numrows + 1;
            do_push = true;
        }

        if (rowobject === null || rowobject === undefined) {
            if (this.type_decl !== undefined) {
                rowobject = new this.type_decl();
            }
            else {
                return er_fail;
            }
        }

        if (do_push === true) {
            this.push(rowobject);
        }
        else {
            this.splice(idx, 0, rowobject);
        }

        if (this.length > 0) {
            this.firstrow = 1;
        }
        else {
            this.firstrow = 0;
        }

        this.lastrow = this.allrows = this.length;

        return er_ok;
    }

    /*
    ** clear
    ** Clear an array of all rows
    */
    clear() {
        this.length = 0;
        this.firstrow = this.lastrow = this.allrows = this.length;
    }
}


/**
* Remoteserver types
*/
rp_local = 1;
rp_private = 2;
rp_shared = 3;

/**
* RemoteServer - just enough to support json-rpc
*/
remoteserver = class IIRemoteServer {
    constructor() {
        this.errorcode = 0;
        this.errortext = '';
        this.flags = '';
        this.image = '';
        this.value = '';
        this.method = '';
        this.params = '';
        this.id = 1;
        this.client = null;
        this.err = 0;
        this.error = '';
        this.url = '';
    }
    
    initiate({ image, type, flags, location, routing }) {
        if (routing != 'http-jsonrpc') {
            this.errorcode = 1;
            this.errortext = 'non-http routing NOT supported. Only "http-jsonrpc" is supported.';
            return er_fail;
        }
        let xhr = new local_XMLHttpRequest();
        xhr.open("GET", location, false);
        xhr.send();
        if (xhr.readyState == 4 && xhr.status == 200) {
            this.url = location;
            return er_ok;
        } else {
            this.errorcode = 2;
            this.errortext = 'Error: ' + varchar(xhr.status) + ' URL: ' + location;
            return er_fail;
        }
    }

    jsonrpcrequest({request}) {
        if (this.url == '') {
            return null;
        }
        let xhr = new local_XMLHttpRequest();
        xhr.open("POST", this.url, false);  // sync - Blocking  - deprecated, see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
        xhr.send(request.value);  // The request is synchronous so we wait for the result
        if (xhr.readyState == 4 && xhr.status == 200) {  // Success
            return xhr.response;
        } else {
            return null;
        }
    }

    release() {
        this.url = '';
    }
}

curremoteserver = new remoteserver();

/**
* StringObject - bare minimum for json-rpc usage
*/
stringobject = class extends String {
    constructor(string) {
        super(...arguments);
        if (string != undefined) {
            this.value = string;
        }
        else {
            this.value = '';
        }
    };

    concatvarchar({ text }) {
        this.value = this.value + text;
    };

    concatstring({ string }) {
        var strobj = null;
        if (string instanceof stringobject) {
            this.value = this.value + string.value;
        }
        else if (typeof arguments[0] === 'object') {
            var args = [...arguments];
            Object.entries(args[0]).forEach(function ([key, value]) {
                let val = value;
                if (val instanceof stringobject) {
                    strobj = value.value;
                    return;
                }
                else {
                    throw 'stringobject.concatstring() argument is not a stringobject!';
                }
            });
            this.value = this.value + strobj;
        }
        else {
            throw 'stringobject.concatstring() argument is not a stringobject!';
        }
    };

    set filehandle(path) {

        var isWebBrowser = false;
        
        if (path == '' || path == null) {
            this.value = null;
            return;
        }

        if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
            var urlinfo = new URL(path);
            isWebBrowser = true;
        }
        else {
            var urlinfo = local_url.parse(path);
        }

        if (urlinfo.protocol == 'https:' || urlinfo.protocol == "http:" ||
            (urlinfo.protocol == "file:" && isWebBrowser == true)) {
            if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
                let request = new XMLHttpRequest;
                try {
                    request.open( "GET", path, false); // "false" makes this request synchronous
                    request.send();
                    this.value = request.response;
                    return;
                }
                catch (err) {
                    throw err;
                }
            }
            else
            {
                /*
                ** Node.js synchronous URL read
                */
                try {
                    var res = local_sync_request('GET', path);
                    if (res.statusCode > 400) {
                        throw 'HTTP request failed with error ' + String(res.statusCode);
                    }
                    this.value = String(res.getBody());
                }
                catch (err) {
                    throw err;
                }
            }
        }
        else {
            /*
            ** Node.js synchronous file read
            */            
            try {
                this.value = String(local_fs.readFileSync(require("path").resolve(__dirname, path), 'utf8'));
            }
            catch (err) {
                throw err;
            }
        }
    }

    split({delimiter = '', ignorecase = false, backwards = false,
        exactrows = null, minrows = null, includedelimiter = false,
        preserveblanklasttoken = false, preserveleadingwhitespace = false}) {
        if (delimiter !== '') {
            var separator = delimiter;
            if (delimiter.includes('\\,') === true) { //Multiple Separators
                separator = '[' + separator.split('\\,').join('') + ']';
            }
            var sep2 = '(' + separator + ')'; //Separator used to create another array for exactrows lastrow
            if (includedelimiter == 1) {
                separator = '(' + separator + ')';
            }
            if (ignorecase == 1) {
                separator = new RegExp(separator, 'ig');
                sep2 = new RegExp(sep2, 'ig');
            } else if (includedelimiter == 1 || delimiter.includes('\\,') === true) {
                separator = new RegExp(separator, 'g');
                sep2 = new RegExp(sep2, 'g');
            }
            var arrStr = this.value.split(separator);
            if (!(sep2 instanceof RegExp)){
                sep2 = new RegExp(sep2, 'g');
            }
            var arrStr2 = this.value.split(sep2);
            if (backwards == 1) {
                arrStr.reverse();
                arrStr2.reverse();
            }
            if (preserveleadingwhitespace == 0) {
                arrStr = arrStr.map(s => (s == ' ') ? ' ' : s.trim()); //split trims unless space is used as delimiter
            } else if (preserveleadingwhitespace == 1) {
                arrStr = arrStr.map(s => (s == ' ') ? ' ' : s.trimEnd());
            }
            if (preserveblanklasttoken == 0) {
                if (arrStr[arrStr.length-1] == '') {
                    arrStr.pop();
                }
            }
            if (minrows !== null) {
                if (minrows > arrStr.length){
                    for (let i=arrStr.length; i < minrows; i++) {
                        arrStr.push('');
                    }
                }
            }
            if (exactrows !== null) {
                if (exactrows > arrStr.length) {
                    for (let i=arrStr.length; i < exactrows; i++) {
                        arrStr.push('');
                    }
                } else if (exactrows < arrStr.length) {
                    //arrStr2 works with all cases such as multiple separators and ignorecase
                    if (includedelimiter == 1) {
                        var last = arrStr2.slice(exactrows-1,arrStr2.length);
                    } else {
                        var last = arrStr2.slice(exactrows*2-2,arrStr2.length);
                    }
                    arrStr.splice(exactrows-1,arrStr.length);
                    arrStr.push(last.join(''));
                }
            }
            //Convert array to array of stringobject
            var arrStrObj = new IIArray(stringobject);
            arrStr.forEach((strVal,index) => {
                let strObj = new stringobject;
                strObj.value = strVal;
                arrStrObj.insertrow({ rownumber : index + 1, rowobject : strObj });
            });
            return arrStrObj;
        }
    }
}

/*
** Needed for AssignJsonRpcResponse2Vars
* -  It is one of its function parameters
*/
scope = class {
    constructor(_scope) {
        this.scope = _scope;
    };
    
    createdynexpr(string, datatype, errors) {
        eval(string);
        return;
    };
}

IIobject = class {
    constructor(classname) {
        this.classname = classname;
    };
}

/**
* JsonValue
*/
jsonvalue = class extends IIobject {
    constructor(classname) {
        super(classname);
    };
}

/**
* IIJsonMember
*/
class IIJsonMember {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

/**
* JsonObject
*/
jsonobject = class extends jsonvalue {
    constructor(members) {
        super('jsonobject');
        this.members = new IIArray();
        var self = this;

        if (members != null && typeof members === 'object') {
            Object.entries(members).forEach(function ([key, value]) {
                let name = key;
                self.addmember({ name, value });
            });
        }
    }

    addmember({ name, value }) {

        var nameandvalue = null;
        var jsonobj = null;

        if (name == '' || name == undefined || name == null) {
            console.log("JsonObject.AddMember(): 'name' must not be empty.");
            return er_fail;
        }

        if (value === undefined) {
            console.log("JsonObject.AddMember(): 'value' must not be undefined.");
            return er_fail;
        }

        switch (typeof value) {
            case 'number':
                jsonobj = new jsonnumber(value);
                break;
            case 'string':
                jsonobj = new jsonstring(value);
                break;
            case 'boolean':
                jsonobj = new jsonboolean(value);
                break;
            case 'object':
                jsonobj = new jsonobject(value);
                break;
            default:
                jsonobj = undefined;
        };

        nameandvalue = new IIJsonMember(name, jsonobj);
        this.members.push(nameandvalue);

        return er_ok;
    }

    getmember({ name = '' }) {

        if (name == '' || name == undefined || name == null) {
            console.log("JsonObject.GetMember(): 'name' must not be empty.");
            return null;
        }

        var idx = 0;
        var index = -1;
        this.members.some(function (element, idx) {
            if (element.name === name) {
                index = idx;
                return true;
            }
        });

        if (index == -1) {
            console.log("JsonObject.GetMember(): member " + name + " not found.");
            return null;
        }

        return this.members[index].value;
    }

    getmembernames({ }) {

        var retarray = new Array(String);

        this.members.forEach(function (element) {
            retarray.push(element.name);
        });

        return retarray;
    }

    newmember({ name, value }) {

        var jv = null;

        if (name == '' || name == undefined || name == null) {
            console.log("JsonObject.NewMember(): 'name' must not be empty.");
            return null;
        }


        jv = new jsonvalue();
        if (jv == null || jv == undefined) {
            return null;
        }

        jv.name = name;
        jv.value = value;
        this.members.push(jv);

        return jv;
    }

    removemember({ name }) {

        var idx = 0;

        if (name == '' || name == undefined || name == null) {
            console.log("JsonObject.RemoveMember(): 'name' must not be empty.");
            return er_fail;
        }

        idx = this.members.indexOf(name);
        if (idx === -1) {
            return er_fail;
        }

        this.members.splice(idx, 1);

        return er_ok;

    }
}

/**
* jsonhandler
*/
jsonhandler = class extends IIobject {
    constructor(allwaysaddclassname, errortext,
        ignoreunknownattributes, indentchar,
        indentcharcount, maxnestinglevel) {
        super('jsonhandler');
        this.allwaysaddclassname = allwaysaddclassname;
        this.errortext = errortext;
        this.ignoreunknownattributes = ignoreunknownattributes;
        this.indentchar = indentchar;
        this.indentcharcount = indentcharcount;
        this.maxnestinglevel = maxnestinglevel;
    };

    parse({ json = null }) {

        var jsonobj = new jsonobject();
        var members = null;
        var result = null;
        var key = null;
        var value = null;
        
        if (json instanceof stringobject) {
            result = JSON.parse(json.value);
        }
        else {
            result = json;
        }
        
        if (!isNull(result)) {
            Object.entries(result).forEach(function ([key, value]) {
                var name = key;
                jsonobj.addmember({ name, value });
            });
        }

        return jsonobj;
    }

    newjsonvalue(value = null) {

        var jsonobj = null;

        switch (typeof value) {
            case 'number':
                jsonobj = new jsonnumber(value);
                break;
            case 'string':
                jsonobj = new jsonstring(value);
                break;
            case 'boolean':
                jsonobj = new jsonboolean(value);
                break;
            case 'object':
                jsonobj = new jsonobject(value);
                break;
            default:
                jsonobj = undefined;
        };

        return jsonobj;

    };

    jsonobject2object({jsonobj, existing_obj,
        default_class = null, default_row_class = null}) {

        var jsonobject = null;
        var framename = null;
        var isWebBrowser = false;
        var tblstr = null;
        var isTableField = null;
        this.errormessage = null;

        if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
            isWebBrowser = true;
            framename = window.document.getElementsByClassName("frameform").item(0).id;
        }

        if (jsonobj === null) {
            console.log("JsonHandler.JsonObject2Object(): 'jsonobj' must not be NULL.");
            return null;
        }

        if (existing_obj != null)
        {
            if (typeof existing_obj === 'object') {
                if (existing_obj instanceof IIArray)
                {
                    existing_obj.length = 0;
                    if (jsonobj.classname == 'jsonobject')
                    {
                        jsonobj.members.forEach(function (element) {
                            if (element.name = 'rows') {
                                if (element.value.classname == 'jsonobject') {
                                    element.value.members.forEach(function (row) {
                                        existing_obj.push(row.value);
                                        if (isWebBrowser == true) {
                                            if (tblstr == null && isTableField == null) {
                                                let row_class = existing_obj.type_decl.name;
                                                let index = row_class.lastIndexOf('_rowclass');  // possibly a tablefield
                                                let tablefieldname = row_class.slice(0, index);
                                                let tablefield = window.document.getElementById(tablefieldname);
                                                if (tablefield != null && tablefield.className == 'tablefield') {
                                                    tblstr = 'window.' + framename + '.' + tablefieldname + '.gridData';
                                                    isTableField = true;
                                                }
                                                else
                                                {
                                                    isTableField = false;
                                                }
                                            }

                                            if (isTableField == true) {
                                                let ref = eval(tblstr);
                                                Vue.set(ref, Number(row.name), row.value.members);
                                                if (row.value.classname == 'jsonobject') {
                                                    row.value.members.forEach (function (column) {
                                                        let str = tblstr + '[' + row.name + ']';
                                                        let ref = null;
                                                        ref = eval(str);
                                                        Vue.set(ref, column.name,  column.value.value);
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                else
                {
                    existing_obj.members.length = 0;
                    jsonobj.forEach(function (element) {
                        existing_obj.members.push(element);
                    });
                }
            }
        }
        else {
            jsonobject = new jsonobject(jsonobj);
        }
    };

    write({ json = null, value = null, indented = 0, sortobjectmembers = false }) {
        if (value == null) {
            console.log('JsonHandler.Write(): \'value\' must not be null.');
            return er_fail;
        }

        if (json == null) {
            console.log('JsonHandler.Write(): \'json\' must not be null.');
            return er_fail;
        }

        function replacer(key, value) {
            // Filtering out properties
            if (value instanceof stringobject) {
                let strobj = { "stringvalue": value.value };
                return strobj;
            }
            else if (value instanceof Date) {
                let date = value.toIngresISOString();
                return date;
            }
            else if (typeof value == 'string') {
                if (value.charAt(4) == '-' && value.charAt(7) == '-' && value.charAt(10) == 'T' &&
                    value.charAt(19) == '.') {
                    let date = new Date(value);
                    value = date.toIngresISOString();
                }
            }
            return value;
        }

        this.errormessage = null;
        if (value instanceof jsonvalue) {
            if (value instanceof jsonobject) {
                let idx_split = 0;
                let num_split = 0;
                var valuestr = null;
                var splitstr = '';
                var idx = 0;
                var startbracket = 0;

                json.value = '{';
                value.members.forEach(function (element) {
                    idx++;
                    idx_split = 0;
                    var depth = 0;

                    var namestr = JSON.stringify(element.name);
                    json.value = json.value + namestr + ':';
                    if (element.value instanceof IIArray) {

                        if (element.value.type_decl.name == 'stringobject') {
                            let num_items = element.value.length;
                            let item_num = 1;
                            valuestr = '[';
                            element.value.forEach(function (stringobject) {
                                valuestr = valuestr + '{"stringvalue":"' + stringobject.value + '"}';
                                if (item_num < num_items) {
                                    valuestr = valuestr + ',';
                                    item_num++;
                                }
                            });
                            valuestr = valuestr + ']';
                        }
                        else if (element.value.type_decl.name == 'decimalobject') {
                            valuestr = JSON.stringify(element.value);
                            valuestr = valuestr.replace(/dec_value/g, "value");
                        }
                        else if (element.value.type_decl.name == 'dateobject') {
                            valuestr = JSON.stringify(element.value);
                            valuestr = valuestr.replace(/date_value/g, "value");
                            valuestr = valuestr.replace(/.000Z/g, "Z");
                        }
                        else {
                            valuestr = JSON.stringify(element.value, replacer);
                        }

                        var split_str = valuestr.split("[");
                        num_split = split_str.length;
                        if (num_split > 1) {
                            split_str.forEach(function (string) {
                                if (idx_split == 0 && num_split > 1) {
                                    if (string != '') {
                                        string = '{"rows":' + string + ':';
                                    }
                                    else {
                                        startbracket = true;
                                    }
                                    depth++;
                                }
                                else if (idx_split == num_split - 1) {
                                    string = string.replace(/\]/g, "]}")
                                    string = '{"rows":[' + string;
                                }
                                else {
                                    string = string.replace(/\]/g, "]}")
                                    if (string.endsWith(':')) {
                                        string = '{"rows":[' + string;
                                    }
                                    else {
                                        string = '{"rows":[' + string + ':';
                                    }
                                }
                                splitstr = splitstr + string;
                                idx_split++;
                            });
                        }
                        else {
                            splitstr = '{"rows":' + split_str + '}';
                        }
                        valuestr = splitstr;
                    }
                    else {
                        if (element.value instanceof Date) {
                            valuestr = '"' + element.value.toIngresISOString() + '"';
                        }
                        else {
                            valuestr = JSON.stringify(element.value, replacer);
                        }
                    }

                    json.value = json.value + valuestr;
                    if (idx < value.members.length) {
                        json.value = json.value + ',';
                    }
                });
                json.value = json.value + '}';
            };
            if (value instanceof jsonstring) {
                json.value = JSON.stringify(value.value.value);
            }
        }
        else {
            this.errormessage = 'JsonHandler.Write(): ERROR writing JsonValue.';
            return er_fail;
        }
        return er_ok;
    }
}

/**
* JsonArray
*/
jsonarray = class extends jsonvalue {
    constructor() {
        super('jsonarray');
        this.items = IIArray(jsonvalue);
    }
}

/**
* JsonBoolean
*/
jsonboolean = class extends jsonvalue {
    constructor(value) {
        super('jsonboolean');
        this.value = value;
    }
}

/**
* JsonNull
*/
jsonnull = class extends jsonvalue {
    constructor() {
        super('jsonnull');
        this.value = null;
    }
}

/**
* JsonNumber
*/
jsonnumber = class extends jsonvalue {
    constructor(value) {
        super('jsonnumber');
        this.textvalue = String(value);
    }

    getvalue({ value }) {

        var value = 0;

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    if (typeof (element.value) == 'object' && element.value instanceof stringobject) {
                        if (element.value != undefined) {
                            eval(element.name + ' = element.value');
                        }
                    }
                    else if (typeof (element.value) != 'string') {
                        eval(element.name + ' = ' + element.value);
                    }
                    else {
                        eval(element.name + ' = "' + element.value + '"');
                    }
                }
            }
        });

        value = Number(this.textvalue);

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return value;
    }
    setvalue({ value }) {

        if (typeof value == 'object') {
            console.log("JsonNumber.SetValue(): Type of 'value' parameter not supported");
            return er_fail;
        }
        else {
            this.textvalue = String(value);
            return er_ok;
        }
    }
}

/**
* JsonString
*/
jsonstring = class extends jsonvalue {
    constructor(value) {
        super('jsonstring');
        this.value = new stringobject(value);
    }
}

/**
* SessionObject - bare minimum to support json-rpc
*/
sessionobject = class sessionobject {
    constructor() {
        this.appflags = null;
        this.jsonhandler = new jsonhandler();
        this.timezone = null;
        this.username = null;
        this.exitcode = null;
    }

    getenv({ name }) {
        if (isBrowser) {
            console.log('GetEnv() method only works under Node.js, not in the Browser.');
            return '';
        }
        if (isNode) {
            let val = process.env[name];
            if (val === undefined) {
                return '';
            }
            else {
                return val;
            }
        }
    }

    setenv({ name, value }) {
        if (isBrowser) {
            console.log('SetEnv() method only works under Node.js, not in the Browser.');
        }
        if (isNode) {
            process.env[name] = value;
        }
    }
}


cursession = new sessionobject();

assignjsonrpcresponse2vars = function({ jsonrpc_response = null,
    var_scope = new scope(), resultvar = null, byref_assign_rule = '',
    result = null, errormessage = null, errorcode = 0, errordata = null }) {
    Object.values(arguments[0]).forEach(function (element) {
        if (typeof (element) == 'object') {
            if (!isNull(element) && element.constructor.name === 'IIByRef') {
                if (typeof (element.value) == 'object') {
                    if (element.name === 'byref_assign_rule') {
                        element.byrefarray.forEach(function (element) {
                            if (typeof (element.value) == 'object') {
                                eval('var ' + element.name + ' = element.objtype' );
                            }
                            else if (typeof (element.value) != 'string') {
                                eval(element.name + ' = ' + element.value);
                            }
                            else {
                                eval(element.name + ' = "' + element.value + '"');
                            }
                        });
                    }
                    else if (element.value == null) {
                        eval(element.name + ' = null');
                    }
                    else if (element.value != undefined) {
                        eval(element.name + ' = element.value');
                    }
                }
                else if (typeof (element.value) != 'string') {
                    eval(element.name + ' = ' + element.value);
                }
                else {
                    eval(element.name + ' = "' + element.value + '"');
                }
            }
        }
    });

    var jo = null;
    var str = new stringobject();
    var str_arr = null;
    var i = 0;
    var rv = 0;
    var jv = null;
    var vname = '';
    var byref_results = null;

    result = null;
    jo = cursession.jsonhandler.parse({ json: jsonrpc_response });
    if (jo === null) {
        if (errormessage === null) {
            errormessage = new stringobject();
        }
        errormessage.value = 'Error Parsing response:' + hc_newline + cursession.jsonhandler.errortext;

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) &&  element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return er_fail;
    }

    jv = jo.getmember({ name: 'result' });
    result = jv;
    if (jv === null) {
        if (errormessage === null) {
            errormessage = new stringobject();
        }
        errormessage.value = 'Invalid JSON-RPC 2.0 response!';
        errorcode = -1;
        errordata = null;
        resultvar = null;
        jo = jo.getmember({ name: 'error' });
        if (jo !== null) {
            jv = jo.getmember({ name: 'code' });
            if (jv !== null) {
                if (jv instanceof jsonnumber) {
                    $byref_errorcode = new IIByRef('value', errorcode, 30, 'null');
                    jv.getvalue({ value: $byref_errorcode });
                    errorcode = $byref_errorcode.value;
                }
            }
            jv = jo.getmember({ name: 'message' });
            if (jv !== null) {
                if (jv instanceof jsonstring) {
                    errormessage = jv.value;
                }
            }
            errordata = jo.getmember({ name: 'data' });
        }

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) &&  element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return er_fail;
    }
    if (!(jv instanceof jsonobject)) {
        if (resultvar !== undefined) {
            $byref_resultvar = new IIByRef('var_name', resultvar, 45, 'jsonvalue');
            rv = setvarfromjsonvalue({ jv: jv, var_name: $byref_resultvar });
            resultvar = $byref_resultvar.value;
        }

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return rv;
    }
    jo = jv;
    jv = jo.getmember({ name: 'byref_results' });
    if (jv === null) {
        if (resultvar !== undefined) {
            $byref_resultvar = new IIByRef('var_name', resultvar, 45, 'jsonvalue');
            rv = setvarfromjsonvalue({ jv: jo, var_name: $byref_resultvar });
            resultvar = $byref_resultvar.value;
        }

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return rv;
    }

    byref_results = jv;
    jv = jo.getmember({ name: 'result' });
    if (jv !== null) {
        if (resultvar !== null) {
            $byref_resultvar = new IIByRef('var_name', resultvar, 45, 'jsonvalue');
            rv = setvarfromjsonvalue({ jv: jv, var_name: $byref_resultvar });
            resultvar = $byref_resultvar.value;
        }
    }

    if (byref_assign_rule != null) {
        let str_arr = byref_assign_rule.byrefarray;
        str_arr.forEach(function (element) {
            let member = byref_results.getmember({ name: element.name });
            if (member != null) {
                let name = element.name;
                $byref_vname = new IIByRef('var_name', element.name, 21, element.objtype);
                rv = setvarfromjsonvalue({ jv: member, var_name: $byref_vname });
                element.value = $byref_vname.value;
            }
        });
    }

    if (rv === er_fail) {
        errormessage.value = 'Error during processing of JSON-RPC 2.0 response!';
        errorcode = -2;
        errordata = null;
    }

    Object.values(arguments[0]).forEach(function (element) {
        if (typeof (element) == 'object') {
            if (!isNull(element) && element.constructor.name === 'IIByRef') {
                eval('element.value  = ' + element.name);
            }
        }
    });

    return rv;
}

setvarfromjsonvalue = function ({ jv = null, var_name = '' }) {

    Object.values(arguments[0]).forEach(function (element) {
        if (typeof (element) == 'object') {
            if (element instanceof  IIByRef) {
                if (typeof (element.value) == 'object') {
                    if (element.value != undefined) {
                        eval(element.name + ' = element.value');
                    }
                }
                else if (typeof (element.value) != 'string') {
                    eval(element.name + ' = ' + element.value);
                }
                else {
                    eval(element.name + ' = "' + element.value + '"');
                }
            }
            else if (element instanceof jsonobject && element.members instanceof IIArray) {
                eval(var_name.value + ' = var_name.objtype');
            }
        }
    });

    var jo = null;
    var b_obj = null;

    if (jv instanceof jsonnull) {
        var_name = null;

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return er_ok;
    }
    else if (jv instanceof jsonboolean) {
        var_name = jv.value;

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return er_ok;
    }
    else if (jv instanceof jsonnumber) {
        var_name = Number(jv.textvalue);

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return er_ok;
    }
    else if (jv instanceof jsonstring) {
        var_name = jv.value.value;

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return er_ok;
    }
    else if (jv instanceof jsonobject) {

        var json_object = null;
        var IIbyref = null;
        var fullname = null;
        var orig_fullname = null;
        var byref = null;

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (element instanceof jsonobject) {
                    json_object = element;
                }
                else if (element instanceof IIByRef) {
                    IIbyref = element;
                }
            }
        });

        byref = IIbyref.objtype;
        fullname = 'byref.';
        orig_fullname = fullname;
  
        let isRows = false;

        /*
        ** Move jsonobject member values into original user
        ** object attribute values
        */
        if (json_object.members.length != 0) {
            Object.getOwnPropertyNames(byref).forEach(
                function (name) {

                    if (isRows == true) {
                        return;  // We have processed the "rows": ... construct
                    }

                    if (isNaN(name)) {

                        let member = json_object.getmember({ name: name });
                        if (member instanceof jsonobject) {
                            fullname = fullname + name + '.';
                            ResolveJsonObject(member, fullname, byref);
                        }
                        else if (member instanceof jsonnumber) {
                            eval(orig_fullname + name + ' = ' + Number(member.textvalue));
                        }
                        else {
                            eval(orig_fullname + name + ' = ' + member.value);
                        }
                    }
                    else if (json_object.members.length == 1 &&
                        json_object.members[0].name == "rows" &&
                        json_object.members[0].value instanceof jsonobject) {

                        /*
                        ** The special {"rows": [{},{}]} object processing
                        */
                        let row_array = json_object.members[0].value;
                        let idx = 0;
                        let isDecimal = false;
                        isRows = true;
                        fullname = 'byref';
                        let orig_fullname = fullname;

                        Object(row_array.members).forEach(function (row) {
                            let row_number = Number(row.name);
                            let member = row.value.members[0];
                            let value = member.value.value;
                            let num_members = row.value.members.length;
                            if (num_members == 3)
                            {
                                /// See if this is the "special" decimal type
                                let i = 0;
                                let hasPrecision = false;
                                let hasValue = false;
                                let  hasScale = false;
                                let name = '';
                                for ( i = 0; i < num_members; i++)
                                {
                                    name = row.value.members[i].name;
                                    if (name == 'precision')
                                    {
                                        hasPrecision = true;
                                    }
                                    else if (name == 'scale') {
                                        hasScale = true;
                                    }
                                    else if (name == 'value') {
                                        hasValue = true;
                                    }
                                }

                                if (hasValue && hasScale && hasPrecision)
                                {
                                    isDecimal = true;
                                }

                            }
                            if (num_members == 1 || isDecimal == true)
                            {
                                if (member.value instanceof jsonobject) {
                                    fullname = orig_fullname + '[' + String(idx) + '].' + member.name;
                                    ResolveJsonObject(member.value, fullname, byref);
                                }
                                else if (member.value instanceof jsonnumber) {
                                    if (byref[row_number] instanceof integerobject || byref[row_number] instanceof floatobject ||
                                        byref[row_number] instanceof decimalobject) {
                                        eval('byref[' + row.name + '].value' + ' = ' + Number(member.value.textvalue));
                                    }
                                    else {
                                        eval('byref[' + row.name + '] = new ' + byref.type_decl + '(Number("' + member.value.textvalue + '"))');
                                    }
                                }
                                else if (byref.type_decl.name != 'stringobject') {
                                    if (value instanceof stringobject) {
                                        eval('byref[' + row.name + '] = new ' + byref.type_decl + '("' + value + '")');
                                    }
                                }
                                else if (byref[row_number] instanceof stringobject) {
                                    eval('byref[' + row.name + '].value' + ' = "' + value + '"');
                                }
                                idx++;
                            }
                            else
                            {
                                for (idx = 0; idx < num_members; idx++) {
                                    let member = row.value.members[idx];
                                    let value = member.value.value;
                                    if (member.value instanceof jsonobject) {
                                        fullname = orig_fullname + '[' + String(idx) + '].' + member.name;
                                        ResolveJsonObject(member.value, fullname, byref);
                                    }
                                    else if (member.value instanceof jsonnumber) {
                                        if (byref[row_number] instanceof integerobject || byref[row_number] instanceof floatobject ||
                                            byref[row_number] instanceof decimalobject) {
                                            eval('byref[' + row.name + '].value' + ' = ' + Number(member.value.textvalue));
                                        }
                                        else {
                                            eval('byref[' + row.name + '].' + member.name + ' = Number("' + member.value.textvalue + '")');
                                        }
                                    }
                                    else if (byref.type_decl.name != 'stringobject') {
                                        if (value instanceof stringobject) {
                                            eval('byref[' + row.name + '].' + member.name + ' = "' + value + '"');
                                        }
                                    }
                                    else if (byref[row_number] instanceof stringobject) {
                                        eval('byref[' + row.name + '].value' + ' = "' + value + '"');
                                    }
                                }
                            }
                        });
                        return;
                    }
                }
            );
        }

        IIbyref.value = byref;

        return er_ok;
    }
    else {
        curexec.trace({ text: 'Unexpected JsonValue class: ' + jv.classname });

        Object.values(arguments[0]).forEach(function (element) {
            if (typeof (element) == 'object') {
                if (!isNull(element) && element.constructor.name === 'IIByRef') {
                    eval('element.value  = ' + element.name);
                }
            }
        });

        return er_fail;
    }

    Object.values(arguments[0]).forEach(function (element) {
        if (typeof (element) == 'object') {
            if (!isNull(element) && element.constructor.name === 'IIByRef') {
                eval('element.value  = ' + element.name);
            }
        }
    });

    return er_ok;

    function ResolveJsonObject(jo = null, fullname = '', byref = null) {

        var orig_fullname = fullname;
        var idx = 0;

        Object(jo.members).forEach(function (member) {
            if (member.value instanceof jsonobject) {
                if (member.name == "rows" && member.value.members instanceof IIArray) {
                    if (orig_fullname.endsWith('.')) {
                       orig_fullname = orig_fullname.replace(/.$/, '');
                    }
                    fullname = orig_fullname;
                }
                else {
                    let num = Number(member.name);
                    if (isNaN(num)) {
                        fullname = orig_fullname + member.name + '.';
                    }
                    else {
                        fullname = orig_fullname + '[' + member.name + ']' + '.';
                    }
                }
                ResolveJsonObject(member.value, fullname, byref)

            }
            else if (member.value instanceof jsonnumber) {
                eval(orig_fullname + member.name + ' = ' + Number(member.value.textvalue));
                idx++;
            }
            else {
                if (member.value.value instanceof stringobject) {
                    eval(orig_fullname + member.name + ' = "' + member.value.value.value + '"');
                }
                else {
                    eval(orig_fullname + member.name + ' = ' + member.value.value);
                }
                idx++;
            }
        });
    }
}

function jsonequals( x, y ) {
	if ( x === y ) return 1;

	if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return 0;

	if ( x.constructor !== y.constructor ) return 0;

	for ( var p in x ) {
		if ( ! x.hasOwnProperty( p ) ) continue;

		if ( ! y.hasOwnProperty( p ) ) return 0;

		if ( x[ p ] === y[ p ] ) continue;

		if ( typeof( x[ p ] ) !== "object" ) return 0;

		if ( ! jsonequals( x[ p ],  y[ p ] ) ) return 0;
	}

	for ( p in y ) {
		if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return 0;
	}
	
	return 1;
}
isequaljson = function ({json1 = null,json2 = null}) {
	if (json1 instanceof stringobject && json2 instanceof stringobject) {
		let jsonObj1 = JSON.parse(json1.value);
		let jsonObj2 = JSON.parse(json2.value);
		return jsonequals(jsonObj1,jsonObj2);
	}
	else {
		return 0;
	}
}

integerobject = class {
	constructor(value) {
		this.value = isDefined(value) ? bigint(value) : 0;
	}
	bitand({value}){
		return this.value & value;
	}
	bitandnot({value}){
		return this.value & ~value;;
	}
	bitor({value}){
		return this.value | value;
	}
	bitxor({value}){
		return this.value ^ value;
	}
	bitnot(){
		return ~this.value;
	}
	bitclear({n}){
		return this.value & ~(1 << n);
	}
	bitflip({n}){
		return this.value ^ (1 << n);
	}
	bitset({n}){
		return this.value | (1 << n);
	}
	bitshift({n}){
		return (n < 0) ? (this.value << -n) : (this.value >> n);
	}
	bittest({n}){
		return (this.value & (1 << n)) === 0 ? 0 : 1;
	}
}
floatobject = class {
	constructor(value) {
		this.value = isDefined(value) ? float8(value) : 0;
	}
}
moneyobject = class {
	constructor(value) {
		this.value = isDefined(value) ? money(value) : 0;
	}
}

Date.prototype.toIngresISOString = function() {
    if (this.isDateOnly) {
        return this.toISOString().split('T')[0];
    } else {
        return this.toISOString().split('.')[0] + "Z";
    }   
}

Date.prototype.add = function(date2) {
    return new Date(this.getTime() + date2.getTime());  
}

Date.prototype.toIngresISOString = function () {
    if (this.isDateOnly) {
        return this.toISOString().split('T')[0];
    } else {
        newdate = this.toISOString();
        newdate = newdate.split('.')[0] + "Z"
        return newdate;
    }
}

dateobject = class {
    constructor(value) {
        this.isDateOnly = false;
        this.isInterval = false;
        this.date_value = isDefined(value) ? date(value) : '';
    }
    set value(value) {
        this.date_value = isDefined(value) ? date(value) : '';
        this.date_value = this.date_value.toIngresISOString();
    }
    get value() {
        return this.date_value;
    }
}

decimalobject = class {
    constructor(value, precision, scale) {
        this.precision = precision || 39;
        this.scale = scale || 0;
        this.dec_value = isDefined(value) ? parseDecimal(value, this.precision, this.scale) : 0;
    }
    set value(value) {
        this.dec_value = isDefined(value) ? parseDecimal(value, this.precision, this.scale) : 0;
    }
    get value() {
        return this.dec_value;
    }
}

uc_osca = class {
    constructor(v_msg_txt) {
	this.v_msg_txt = v_msg_txt;
    }
}
