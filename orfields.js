/**
 * @file OpenROAD ECMAScript / Vue.js component definitions
 * @license Copyright(c) 2020 Actian Corporation
 * @copyright
 * This is an unpublished work containing confidential and proprietary
 * information of Actian Corporation.  Use, disclosure, reproduction,
 * or transfer of this work without the express written consent of
 * Actian Corporation is prohibited.
 */

version = [1, 0, 1]

//Colors
cc_foreground = "rgb(0,0,0)"
cc_background = "rgb(255,255,255)"
cc_black = "rgb(0,0,0)"
cc_white = "rgb(255,255,255)"
cc_red = "rgb(128,0,0)"
cc_green = "rgb(0,128,0)"
cc_blue = "rgb(0,0,128)"
cc_yellow = "rgb(128,128,0)"
cc_cyan = "rgb(0,128,128)"
cc_magenta = "rgb(128,0,128)"
cc_pink = "rgb(128,0,128)"
cc_brown = "rgb(64,0,0)"
cc_orange = "rgb(192,64,0)"
cc_purple = "rgb(64,0,192)"
cc_gray = "rgb(128,128,128)"
cc_light_red = "rgb(255,0,0)"
cc_light_green = "rgb(0,255,0)"
cc_light_blue = "rgb(0,0,255)"
cc_light_yellow = "rgb(255,255,0)"
cc_light_cyan = "rgb(0,255,255)"
cc_light_pink = "rgb(255,0,255)"
cc_light_brown = "rgb(128,64,0)"
cc_light_orange = "rgb(255,128,0)"
cc_light_purple = "rgb(128,0,255)"
cc_light_gray = "rgb(160,160,164)"
cc_pale_red = "rgb(255,128,128)"
cc_pale_green = "rgb(192,220,192)"
cc_pale_blue = "rgb(166,202,240)"
cc_pale_yellow = "rgb(255,255,128)"
cc_pale_cyan = "rgb(128,255,255)"
cc_pale_pink = "rgb(255,128,255)"
cc_pale_brown = "rgb(223,160,96)"
cc_pale_orange = "rgb(255,128,32)"
cc_pale_purple = "rgb(192,130,255)"
cc_pale_gray = "rgb(192,192,192)"
cc_transparent = "rgb(0,0,11)"

//Field Biases
fb_resizeable = 1
fb_moveable = 2
fb_flexible = 3
fb_markable = 4
fb_clickpoint = 8
fb_changeable = 16
fb_landable = 32
fb_dragbox = 64
fb_dragsegment = 128
fb_visible = 256
fb_dimmed = 512
fb_invisible = 1024
fb_viewable = 4096

Vue.component('buttonfield', {
  template: `<button type="button">{{btnprop.textlabel}}</button>`,
  props: {
    btnprop: Object
  }
})

Vue.component('entryfield', {
  template: `<input v-bind:type="entprop.type" v-bind:value="entprop.value" v-on:input="$emit('input', $event.target.value)" />`,
  props: {
    entprop: Object
  }
})

Vue.component('entryfieldmultiline', {
  template: `<textarea v-bind:value="entprop.textvalue" v-on:input="$emit('input', $event.target.textvalue)"/>`,
  props: {
    entprop: Object
  }
})

Vue.component('freetrim', {
  template: `<span>{{lblprop.stringvalue}}</span>`,
  props: {
    lblprop: Object
  }
})

Vue.component('boxtrim', {
  template: `<span style="white-space: pre;">{{boxprop.stringvalue}}</span>`,
  props: {
    boxprop: Object
  }
})

Vue.component('imagetrim', {
  template: `<img />`
})

Vue.component('optionfield', {
  template: `<select v-model="optprop.curenumvalue">
    <option v-for="choice in optprop.choicelist" v-bind:value="choice.value">{{choice.text}}</option>
  </select>`,
  props: {
    optprop: Object
  }
})

Vue.component('listfield', {
  template: `<select v-bind:size="listprop.choicelist.length" style="" v-model="listprop.curenumvalue">
    <option v-for="choice in listprop.choicelist" v-bind:value="choice.value">{{choice.text}}</option>
  </select>`,
  props: {
    listprop: Object
  }
})

Vue.component('radiofield', {
  template: `<div>
  <label v-for="choice in radprop.choicelist">
  <input type="radio" v-bind:name="radprop.name" v-bind:value="choice.value" v-model="radprop.curenumvalue"/>
  <span class="label-body" style="margin-top: 5px; margin-botttom: 0px;">{{choice.text}}</span>
  </label></div>`,
  props: {
	radprop: Object
  }
})

Vue.component('togglefield', {
  template: `<label>
	<input type="checkbox" v-model="togprop.value" style="margin-bottom: 0px; line-height: 1.0;"/>
	<span class="label-body" v-if="togprop.value && togprop.ontextlabel !== ''">{{togprop.ontextlabel}}</span>
	<span class="label-body" v-else-if="togprop.value == false && togprop.offtextlabel !== ''">{{togprop.offtextlabel}}</span>
	<span class="label-body" v-else>{{togprop.offtextlabel || togprop.ontextlabel}}</span>
	</label>`,
  props: {
    togprop: Object
  }
})

Vue.component('sliderfield', {
  template: `<div>
  <label>{{sldprop.value}}</label>
  <input type="range" v-bind:min="sldprop.minvalue" v-bind:max="sldprop.maxvalue" v-model="sldprop.value">
  </div>`,
  props: {
    sldprop: Object
  }
})

Vue.component('segmentshape', {
  template: `<svg>
  <line v-bind:x1="lineprop.point1x" v-bind:y1="lineprop.point1y" v-bind:x2="lineprop.point2x" v-bind:y2="lineprop.point2y" v-bind:style="{stroke:lineprop.linecolor}"/>
  </svg>`,
  props: {
    lineprop: Object
  }
})

Vue.component('rectangleshape', {
  template: `<svg>
  <rect v-bind:width="rectprop.width" v-bind:height="rectprop.height" v-bind:style="{fill:rectprop.bgcolor,stroke:rectprop.linecolor}"/>
  </svg>`,
  props: {
    rectprop: Object
  }
})

Vue.component('ellipseshape', {
  template: `<svg>
  <ellipse v-bind:cx="elpsprop.cx" v-bind:cy="elpsprop.cy" v-bind:rx="elpsprop.rx" v-bind:ry="elpsprop.ry" v-bind:style="{fill:elpsprop.bgcolor,stroke:elpsprop.linecolor}"/>
  </svg>`,
  props: {
    elpsprop: Object
  }
})

Vue.component('tablefield', {
  template: `<table v-bind="$attrs">
    <thead>
      <tr>
        <th v-for="key in tcols">
          {{key}}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in tdata">
        <td v-for="key in tcols" v-bind="entry">
          {{entry[key]}}
        </td>
      </tr>
    </tbody>
  </table>`,
  props: {
    tdata: Array,
    tcols: Array,
    currow: 0,
    activerow: 0
  }
})

tablefield = class extends IIArray {
    constructor(type_decl) {
        super(...arguments);
        this.currow = 0;
        this.activerow = 0;
    }
}

function highlight_row() {
    var tablefields = document.getElementsByClassName('tablefield');
    for (var idx = 0; idx < tablefields.length; idx++) {
        var table = document.getElementById(tablefields[idx].id);
        var cells = table.getElementsByTagName('td');

        for (var i = 0; i < cells.length; i++) {
            // Take each cell
            var cell = cells[i];
            // do something on onclick event for cell
            cell.onclick = function () {
                // Get the row id where the cell exists
                var rowId = this.parentNode.rowIndex;

                var rowsNotSelected = table.getElementsByTagName('tr');
                for (var row = 0; row < rowsNotSelected.length; row++) {
                    var unselcells = rowsNotSelected[row].getElementsByTagName('td');
                    for (var x = 0; x < unselcells.length; x++)
                    {
                        let element = document.querySelector('table#' + table.id + ' td:nth-child('+ String(x + 1) + ')');
                        let styles = getComputedStyle(element);
                        let bgcolor = styles.getPropertyValue('background-color');
                        let fgcolor = styles.getPropertyValue('color');
                        if (typeof unselcells[x].origColors === "undefined") {
                            unselcells[x].origColors = {fgColor: fgcolor, bgColor: bgcolor};
                        }
                        else {
                            fgcolor = unselcells[x].origColors.fgColor;
                            bgcolor = unselcells[x].origColors.bgColor;
                        }
                        unselcells[x].style.backgroundColor = bgcolor;
                        unselcells[x].style.color = fgcolor;
                    }
                    rowsNotSelected[row].classList.remove('selected');
                }

                var rowSelected = table.getElementsByTagName('tr')[rowId];
                rowSelected.className += " selected";
                
                var trcells = rowSelected.cells;
                for (var cellnum = 0; cellnum < trcells.length; cellnum++) {
                    trcells[cellnum].style.backgroundColor = "black";
                    trcells[cellnum].style.color = "white";
                }
                var thisClassCurrow = String(this.parentNode.parentNode.parentNode.id) + '.currow';
                eval(thisClassCurrow + ' = ' + String(rowId));
                
                var thisClassActiverow = String(this.parentNode.parentNode.parentNode.id) + '.activerow';
                eval(thisClassActiverow + ' = ' + String(rowId));
            }
        }
    }
} //end of highlight_row() function

window.onload = highlight_row;