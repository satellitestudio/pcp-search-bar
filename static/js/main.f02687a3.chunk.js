(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(e,a,t){e.exports={container:"multi-select_container__1HUhX",selectionsContainer:"multi-select_selectionsContainer__3NK8I",selectionItem:"multi-select_selectionItem__2QwN_",selectionItemRemoveBtn:"multi-select_selectionItemRemoveBtn__294_q",inputText:"multi-select_inputText__MUFP3",toggleBtn:"multi-select_toggleBtn__2OjCF",listContainer:"multi-select_listContainer__2MVO3"}},181:function(e,a,t){"use strict";t.r(a);var l=t(0),n=t.n(l),i=t(66),r=t.n(i),o=(t(81),t(82),t(22)),c=t(40),s=t.n(c),d=function(){return n.a.createElement(l.Fragment,null,n.a.createElement("h1",{className:s.a.title},"Pew Carrier Portal prototypes"),n.a.createElement("nav",{className:s.a.nav},n.a.createElement(o.a,{to:"".concat("/pcp-search-bar","/search")},"Search"),n.a.createElement(o.a,{to:"".concat("/pcp-search-bar","/scrolling")},"History scroll")))},u=t(1),b=t(12),m=t(32),p=t(41),f=t.n(p),h=t(33),g=t.n(h),I=t(2),y=t(6),C=t.n(y),v=t(8),S=t(68),O=t(31),E=new RegExp("\xa0","g"),M=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(/\s/gi,"\xa0")},A=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(E," ")},R=function(e){return e.replace(/[.*+?^${}\/()|[\]\\]/g,"")},T=function(e){return e?e.replace(/:/gi," ").replace(/,/gi," ").split(" ").filter(function(e){return e}):[]},N=function(e){return null===e?{}:e.reduce(function(e,a){var t=a.type,l=a.id,n=a.label;return e[t]?(e[t].values.push({id:l,label:n}),e):Object(I.a)({},e,Object(O.a)({},t,{type:t,values:[{id:l,label:n}]}))},{})},j=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:" ";return function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:" ",t=Object.values(e).length-1;return Object.values(e).reduce(function(e,l,n){return"".concat(""!==e?"".concat(e," "):"").concat(l.type,":").concat(l.values.map(function(e){return M(e.label)}).join(",")).concat(n===t?a:"")},"")}(N(e),a)},_={flag:"flag",rfmo:"rfmo",vessel:"vessel",after:"after",before:"before",port:"port"},B=[_.flag,_.rfmo,_.vessel,_.after,_.before],L=[_.vessel],k=[_.after,_.before],P=function(e){var a=e.itemToString,t=e.setDownshiftRef,l=e.downshiftRefLoaded,i=e.initialInputValue,r=e.initialSelection,o=e.onChange,c=e.customEventHandler,s=e.stateReducer,d=e.items,b=e.onStateChange,p=e.loading?[].concat(Object(u.a)(d),[{type:"loading",id:"loading",label:"loading"}]):d;return n.a.createElement(v.a,{onChange:o,initialInputValue:i,initialSelectedItem:r,stateReducer:s,itemToString:a,onStateChange:b,defaultHighlightedIndex:0},function(e){!1===l&&t(e);var i=e.getInputProps,r=e.getMenuProps,o=e.getItemProps,s=e.isOpen,d=e.inputValue,b=e.selectedItem,f=e.highlightedIndex;return n.a.createElement("div",{className:C.a.searchContainer},n.a.createElement("div",null,!s&&n.a.createElement("div",{className:C.a.searchErrorsContainer},function(e,a){if(!e)return"";var t=null!==a?Array.from(new Set([].concat(Object(u.a)(a.map(function(e){return M(e.label)})),Object(u.a)(a.map(function(e){return e.type}))))):[],l=T(e).filter(function(e){return!t.some(function(a){return a===e})}),i=R(e);return l.length&&l.forEach(function(e){i=i.replace(new RegExp("\\b".concat(R(e),"\\b"),"g"),"<span class=".concat(C.a.searchItemError,">").concat(e,"</span>"))}),n.a.createElement("span",{dangerouslySetInnerHTML:{__html:i}})}(d||"",b)),n.a.createElement("input",Object.assign({className:C.a.searchInput},i({placeholder:"Start searching",onKeyDown:void 0!==c?function(a){return c(a,e)}:void 0,onClick:void 0!==c?function(a){return c(a,e)}:void 0}),{spellCheck:!1}))),s?n.a.createElement("div",{className:C.a.optionListContainer},p.length>0?n.a.createElement(S.a,Object.assign({height:300,itemSize:40,itemCount:p.length,outerElementType:"ul",className:C.a.optionList},r()),function(e){var t=e.index,l=e.style,i=p[t];return"loading"===i.type?n.a.createElement("li",{key:i.id,className:C.a.optionlistItemLoading,style:Object(I.a)({},l)},n.a.createElement("span",{className:C.a.spinner})):n.a.createElement("li",Object.assign({key:i.id,className:C.a.optionlistItem},o({item:i,index:t}),{style:Object(I.a)({},l,{backgroundColor:f===t?"#ccc":"transparent",color:b===i?"#0f0f0f":"#000"})}),n.a.createElement("div",{className:C.a.optionListText},i.type,":"," ",i.type===_.flag&&n.a.createElement(m.a,{iso:i.id})," ",a(i)),f===t&&n.a.createElement("span",{className:C.a.optionlistItemPlaceholder},function(e){var a="Press \u23ce to";switch(e){case _.flag:return"".concat(a," see the activity of carriers from this flag state");case _.rfmo:return"".concat(a," see the activity that occurred in this RFMO area");case _.after:return"".concat(a," see the activity that occurred after this date");case _.before:return"".concat(a," see the activity that occurred before this date");case _.vessel:return"".concat(a," see the activity from this carrier");default:return"".concat(a," select")}}(i.type)))}):n.a.createElement("span",{className:C.a.optionlistItem},"There are no filters matching your query")):null)})},w=t(16),G=t(21),D=t.n(G),U=t(9),V=function(e,a,t){for(var l=a&&a.map(function(e){return e.type})||[],n=a&&a.map(function(e){return e.label})||[],i={},r=T(e).map(A).filter(function(e){return l.includes(e)?!!i[e]||(i[e]=!0,!1):!n.includes(e)}),o=0,c=t;c>0;c--)if(":"===e[c]){o=c;break}if(-1===e.slice(o,t+1).indexOf(" ")){for(var s=0,d=o;d>0;d--)if(" "===e[d]){s=d+1;break}var u=e.slice(s,o);u&&r.push(u)}return Array.from(new Set(r))},K=Object(U.a)(function(e,a){return e.reduce(function(e,a){return Object(w.a)(e,a,{keys:[{key:"type",threshold:w.b.EQUAL},{key:"label",threshold:w.b.WORD_STARTS_WITH}]})},a)}),x=Object(U.a)(function(e,a){return a.length>0?e.filter(function(e){return!a.includes(e.id)}):e}),H=function(e,a,t,l){if(!a)return e;var n=t&&t.map(function(e){return e.id})||[],i=V(a,t,l),r=x(e,n);return K(i,r)},F=t(69),W=t.n(F),Z=function(e){var a=e.selectedItems,t=e.onChange,i=function(e,a){var t={loading:!1,staticData:e,selectedItem:[],cursorPosition:0,search:a||"",results:e,cachedResults:e},n=Object(l.useReducer)(function(e,a){switch(a.type){case"inputChange":return Object(I.a)({},e,{search:a.payload.search,selectedItem:a.payload.selectedItem});case"setCursorPosition":return Object(I.a)({},e,{cursorPosition:a.payload});case"startSearch":var t=e.staticData,l=e.search,n=e.selectedItem,i=e.cursorPosition;return Object(I.a)({},e,{results:H(t,l,n,i),loading:a.payload});case"endSearch":return Object(I.a)({},e,{results:[].concat(Object(u.a)(e.results),Object(u.a)(a.payload)),cachedResults:D()([].concat(Object(u.a)(e.cachedResults),Object(u.a)(a.payload)),"id"),loading:!1});default:return e}},t),i=Object(b.a)(n,2),r=i[0],o=i[1],c=r.search,s=r.selectedItem,d=r.cursorPosition;return Object(l.useEffect)(function(){var e=V(c,s,d),a=e.filter(function(e){return B.includes(e)}),t=0===a.length||a.some(function(e){return L.includes(e)}),l=s.map(function(e){return e.id}),n=s.map(function(e){return e.label}),i=e.filter(function(e){return!n.includes(e)&&!B.includes(e)}).join(","),r=t&&""!==i;if(o({type:"startSearch",payload:r}),r){var u=new AbortController,b="https://vessels-dot-world-fishing-827.appspot.com/datasets/indonesia/vessels?query=".concat(i,"&offset=0");return fetch(b,{signal:u.signal}).then(function(e){return e.status>=200&&e.status<300?Promise.resolve(e):Promise.reject(new Error(e.statusText))}).then(function(e){return e.json()}).then(function(e){var a=e.entries.filter(function(e){return e.name}).map(function(e){return{id:e.vesselId,label:e.name,type:"vessel"}}).filter(function(e){return!l.includes(e.id)});o({type:"endSearch",payload:a})}).catch(function(e){"AbortError"!==e.name&&console.error("Oops!",e),o({type:"endSearch",payload:[]})}),function(){return u.abort()}}},[c,d,s]),[r,o]}(e.staticOptions,""),r=Object(b.a)(i,2),o=r[0],c=r[1],s=o.results,d=o.loading,m=o.cachedResults,p=Object(l.useMemo)(function(){return W()(function(e){c({type:"inputChange",payload:e})},100)},[c]),f=Object(l.useCallback)(function(e,a){if(e.hasOwnProperty("inputValue")){var t=a.inputValue,l=void 0===t?"":t,n=a.selectedItem;p({search:l||"",selectedItem:n})}},[p]),h=function(e,a){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:" ",l=e.selectedItem||[],n=l.some(function(e){return e.type===a.selectedItem.type}),i=k.includes(a.selectedItem.type),r=Object(u.a)(l);i&&!n||!i?r.push(a.selectedItem):r=r.map(function(e){return e.type===a.selectedItem.type?a.selectedItem:e});var o=j(r,t);return Object(I.a)({},a,{selectedItem:r,inputValue:o})},g=function(e,a){var t=e?function(e){return e.split(" ").filter(function(e){return e}).map(function(e){var a=e.split(":"),t=Object(b.a)(a,2),l=t[0],n=t[1];return{type:l,labels:n?n.split(",").map(A).filter(function(e){return e}):[]}})}(e):null;return null!==t?a.filter(function(e){return void 0!==t.find(function(a){return a.type===e.type&&void 0!==a.labels&&a.labels.includes(e.label)})}):[]},y=Object(l.useCallback)(function(e,a){var t={};if(!a.selectedItem||!e.selectedItem)return a;if(e.selectedItem.length===a.selectedItem.length)return a;var l=D()(a.selectedItem,"id").filter(function(e){return!!e&&(void 0!==t[e.type]?!k.includes(e.type):(t[e.type]=!0,!0))}),n=j(l);return Object(I.a)({},a,{inputValue:n,selectedItem:l})},[]),C=Object(l.useCallback)(function(e,a){var t=a.inputValue||"",l=e.selectedItem||[],n=D()([].concat(Object(u.a)(l),Object(u.a)(m)),"id"),i=g(t,n),r=function(e,a){if(!e||!a)return 0;for(var t=Math.max(a.length,e.length),l=0;l<t;l++){if(void 0===e[l])return l-1;if(e[l]!==a[l])return l}return 0}(a.inputValue||"",e.inputValue||"");return c({type:"setCursorPosition",payload:r}),Object(I.a)({},a,{selectedItem:i,isOpen:""!==t&&","!==t[r]})},[m,c]),S=Object(l.useCallback)(function(e,a){switch(a.type){case v.a.stateChangeTypes.keyDownEnter:case v.a.stateChangeTypes.clickItem:return h(e,a);case"keyDownComa":return h(e,a,"");case"externalChanges":return y(e,a);case v.a.stateChangeTypes.changeInput:return C(e,a);default:return Object(I.a)({},a,{inputValue:a.inputValue||e.inputValue||"",selectedItem:a.selectedItem||e.selectedItem||[]})}},[C,y]),O=Object(l.useCallback)(function(e,a){if("ArrowLeft"===e.key||"ArrowRight"===e.key||"click"===e.type){var t=e.target.selectionStart;c({type:"setCursorPosition",payload:t})}var l=a.highlightedIndex,n=a.inputValue,i=a.setState,r=""!==n&&" "!==n,o=" "===e.key,d=","===e.key,u=1===s.length;if(r&&(o||d)&&u&&(e.nativeEvent.preventDownshiftDefault=!0,null!==l&&l>=0)){var b=s[l];b&&i({type:"keyDownComa",selectedItem:b,inputValue:n})}},[c,s]),E=Object(l.useCallback)(function(e){return e?e.label:""},[]),M=Object(l.useMemo)(function(){return null!==a?j(a):""},[a]),R=Object(l.useMemo)(function(){return a||[]},[a]),T=Object(l.useRef)(null),N=Object(l.useCallback)(function(e){T.current=e},[]);return Object(l.useEffect)(function(){null!==T.current&&(0,T.current.setState)({type:"externalChanges",selectedItem:a})},[a]),n.a.createElement(P,{items:s,loading:d,onChange:t,setDownshiftRef:N,downshiftRefLoaded:null!==T.current,itemToString:E,stateReducer:S,selectedItems:a,initialSelection:R,initialInputValue:M,customEventHandler:O,onStateChange:f})},Y=t(70),J=t(71),z=t(74),Q=t(72),q=t(75),X=t(13),$=t.n(X),ee=function(e){function a(){var e,t;Object(Y.a)(this,a);for(var l=arguments.length,i=new Array(l),r=0;r<l;r++)i[r]=arguments[r];return(t=Object(z.a)(this,(e=Object(Q.a)(a)).call.apply(e,[this].concat(i)))).input=n.a.createRef(),t.itemToString=function(e){return e?e.label:""},t.handleChange=function(e){t.props.selectedItems.includes(e)?t.props.onRemoveItem(e):t.props.onSelectedItem(e)},t}return Object(q.a)(a,e),Object(J.a)(a,[{key:"getItems",value:function(e){return e?Object(w.a)(this.props.options,e,{keys:["label"]}):this.props.options}},{key:"stateReducer",value:function(e,a){switch(a.type){case v.a.stateChangeTypes.keyDownEnter:case v.a.stateChangeTypes.clickItem:return Object(I.a)({},a,{highlightedIndex:e.highlightedIndex,isOpen:!0,inputValue:""});default:return a}}},{key:"render",value:function(){var e=this,a=this.props,t=a.selectedItems,l=a.onRemoveItem;return n.a.createElement(v.a,{stateReducer:this.stateReducer,selectedItem:null,onChange:this.handleChange,itemToString:this.itemToString},function(a){var i=a.getInputProps,r=a.getToggleButtonProps,o=a.getMenuProps,c=a.isOpen,s=a.inputValue,d=a.getItemProps,u=a.highlightedIndex,b=a.toggleMenu;return n.a.createElement("div",{className:$.a.container},n.a.createElement("div",{onClick:function(){b(),!c&&null!==e.input.current&&e.input.current.focus()}},n.a.createElement("div",{className:$.a.selections},t.length>0?t.map(function(e){return n.a.createElement("div",{key:e.id,className:$.a.selectionItem},n.a.createElement("div",null,n.a.createElement("span",null,e.label),n.a.createElement("button",{onClick:function(a){a.stopPropagation(),l(e)},className:$.a.selectionItemRemoveBtn},"\ud835\ude05")))}):"Select a value",n.a.createElement("input",Object.assign({},i({ref:e.input,onKeyUp:function(e){"Backspace"!==e.key||s||l(t[t.length-1])}}),{className:$.a.inputText}))),n.a.createElement("button",Object.assign({},r({onClick:function(e){e.stopPropagation()}}),{className:$.a.toggleBtn}),n.a.createElement("svg",{viewBox:"0 0 20 20",preserveAspectRatio:"none",width:16,fill:"transparent",stroke:"#979797",strokeWidth:"1.1px",transform:c?"rotate(180)":void 0},n.a.createElement("path",{d:"M1,6 L10,15 L19,6"})))),n.a.createElement("ul",Object.assign({},o(),{className:$.a.listContainer}),c?e.getItems(s).map(function(e,a){return n.a.createElement("li",Object.assign({key:e.id},d({item:e,index:a}),{style:{backgroundColor:u===a?"#ccc":"transparent",color:t.includes(e)?"#0f0f0f":"#000"}}),e.label)}):null))})}}]),a}(n.a.Component),ae=function(e){return e?"".concat(e.getFullYear(),"/").concat(e.getMonth()+1,"/").concat(e.getDate()):""},te=[2017],le=te.flatMap(function(e){return Array.from(Array(12).keys()).reduce(function(a,t){var l=new Date(Date.UTC(e,t+1,0)).getDate(),n=Array.from(Array(l).keys()).reduce(function(a,l){var n=new Date(Date.UTC(e,t,l+1));return a.push({id:n.toISOString(),label:ae(n)}),a},[]);return[].concat(Object(u.a)(a),Object(u.a)(n))},[])}),ne=new Date(Date.UTC(te[te.length-1]+1,0)),ie={id:ne.toISOString(),label:ae(ne)},re=[{id:"ICCAT",label:"ICCAT"},{id:"IOTC",label:"IOTC"},{id:"WCPFC",label:"WCPFC"},{id:"IATTC",label:"IATTC"},{id:"AIDCP",label:"AIDCP"},{id:"CCSBT",label:"CCSBT"}].map(function(e){return Object(I.a)({},e,{type:_.rfmo})}),oe=[{id:"ABW",label:"Aruba"},{id:"AFG",label:"Afghanistan"},{id:"AGO",label:"Angola"},{id:"AIA",label:"Anguilla"},{id:"ALA",label:"\xc5land Islands"},{id:"ALB",label:"Albania"},{id:"AND",label:"Andorra"},{id:"ARE",label:"United Arab Emirates"},{id:"ARG",label:"Argentina"},{id:"ARM",label:"Armenia"},{id:"ASM",label:"American Samoa"},{id:"ATA",label:"Antarctica"},{id:"ATF",label:"French Southern and Antarctic Lands"},{id:"ATG",label:"Antigua and Barbuda"},{id:"AUS",label:"Australia"},{id:"AUT",label:"Austria"},{id:"AZE",label:"Azerbaijan"},{id:"BDI",label:"Burundi"},{id:"BEL",label:"Belgium"},{id:"BEN",label:"Benin"},{id:"BFA",label:"Burkina Faso"},{id:"BGD",label:"Bangladesh"},{id:"BGR",label:"Bulgaria"},{id:"BHR",label:"Bahrain"},{id:"BHS",label:"Bahamas"},{id:"BIH",label:"Bosnia and Herzegovina"},{id:"BLM",label:"Saint Barth\xe9lemy"},{id:"SHN",label:"Saint Helena Ascension and Tristan da Cunha"},{id:"BLR",label:"Belarus"},{id:"BLZ",label:"Belize"},{id:"BMU",label:"Bermuda"},{id:"BOL",label:"Bolivia"},{id:"BES",label:"Caribbean Netherlands"},{id:"BRA",label:"Brazil"},{id:"BRB",label:"Barbados"},{id:"BRN",label:"Brunei"},{id:"BTN",label:"Bhutan"},{id:"BVT",label:"Bouvet Island"},{id:"BWA",label:"Botswana"},{id:"CAF",label:"Central African Republic"},{id:"CAN",label:"Canada"},{id:"CCK",label:"Cocos (Keeling) Islands"},{id:"CHE",label:"Switzerland"},{id:"CHL",label:"Chile"},{id:"CHN",label:"China"},{id:"CIV",label:"Ivory Coast"},{id:"CMR",label:"Cameroon"},{id:"COD",label:"DR Congo"},{id:"COG",label:"Republic of the Congo"},{id:"COK",label:"Cook Islands"},{id:"COL",label:"Colombia"},{id:"COM",label:"Comoros"},{id:"CPV",label:"Cape Verde"},{id:"CRI",label:"Costa Rica"},{id:"CUB",label:"Cuba"},{id:"CUW",label:"Cura\xe7ao"},{id:"CXR",label:"Christmas Island"},{id:"CYM",label:"Cayman Islands"},{id:"CYP",label:"Cyprus"},{id:"CZE",label:"Czechia"},{id:"DEU",label:"Germany"},{id:"DJI",label:"Djibouti"},{id:"DMA",label:"Dominica"},{id:"DNK",label:"Denmark"},{id:"DOM",label:"Dominican Republic"},{id:"DZA",label:"Algeria"},{id:"ECU",label:"Ecuador"},{id:"EGY",label:"Egypt"},{id:"ERI",label:"Eritrea"},{id:"ESH",label:"Western Sahara"},{id:"ESP",label:"Spain"},{id:"EST",label:"Estonia"},{id:"ETH",label:"Ethiopia"},{id:"FIN",label:"Finland"},{id:"FJI",label:"Fiji"},{id:"FLK",label:"Falkland Islands"},{id:"FRA",label:"France"},{id:"FRO",label:"Faroe Islands"},{id:"FSM",label:"Micronesia"},{id:"GAB",label:"Gabon"},{id:"GBR",label:"United Kingdom"},{id:"GEO",label:"Georgia"},{id:"GGY",label:"Guernsey"},{id:"GHA",label:"Ghana"},{id:"GIB",label:"Gibraltar"},{id:"GIN",label:"Guinea"},{id:"GLP",label:"Guadeloupe"},{id:"GMB",label:"Gambia"},{id:"GNB",label:"Guinea-Bissau"},{id:"GNQ",label:"Equatorial Guinea"},{id:"GRC",label:"Greece"},{id:"GRD",label:"Grenada"},{id:"GRL",label:"Greenland"},{id:"GTM",label:"Guatemala"},{id:"GUF",label:"French Guiana"},{id:"GUM",label:"Guam"},{id:"GUY",label:"Guyana"},{id:"HKG",label:"Hong Kong"},{id:"HMD",label:"Heard Island and McDonald Islands"},{id:"HND",label:"Honduras"},{id:"HRV",label:"Croatia"},{id:"HTI",label:"Haiti"},{id:"HUN",label:"Hungary"},{id:"IDN",label:"Indonesia"},{id:"IMN",label:"Isle of Man"},{id:"IND",label:"India"},{id:"IOT",label:"British Indian Ocean Territory"},{id:"IRL",label:"Ireland"},{id:"IRN",label:"Iran"},{id:"IRQ",label:"Iraq"},{id:"ISL",label:"Iceland"},{id:"ISR",label:"Israel"},{id:"ITA",label:"Italy"},{id:"JAM",label:"Jamaica"},{id:"JEY",label:"Jersey"},{id:"JOR",label:"Jordan"},{id:"JPN",label:"Japan"},{id:"KAZ",label:"Kazakhstan"},{id:"KEN",label:"Kenya"},{id:"KGZ",label:"Kyrgyzstan"},{id:"KHM",label:"Cambodia"},{id:"KIR",label:"Kiribati"},{id:"KNA",label:"Saint Kitts and Nevis"},{id:"KOR",label:"South Korea"},{id:"UNK",label:"Kosovo"},{id:"KWT",label:"Kuwait"},{id:"LAO",label:"Laos"},{id:"LBN",label:"Lebanon"},{id:"LBR",label:"Liberia"},{id:"LBY",label:"Libya"},{id:"LCA",label:"Saint Lucia"},{id:"LIE",label:"Liechtenstein"},{id:"LKA",label:"Sri Lanka"},{id:"LSO",label:"Lesotho"},{id:"LTU",label:"Lithuania"},{id:"LUX",label:"Luxembourg"},{id:"LVA",label:"Latvia"},{id:"MAC",label:"Macau"},{id:"MAF",label:"Saint Martin"},{id:"MAR",label:"Morocco"},{id:"MCO",label:"Monaco"},{id:"MDA",label:"Moldova"},{id:"MDG",label:"Madagascar"},{id:"MDV",label:"Maldives"},{id:"MEX",label:"Mexico"},{id:"MHL",label:"Marshall Islands"},{id:"MKD",label:"Macedonia"},{id:"MLI",label:"Mali"},{id:"MLT",label:"Malta"},{id:"MMR",label:"Myanmar"},{id:"MNE",label:"Montenegro"},{id:"MNG",label:"Mongolia"},{id:"MNP",label:"Northern Mariana Islands"},{id:"MOZ",label:"Mozambique"},{id:"MRT",label:"Mauritania"},{id:"MSR",label:"Montserrat"},{id:"MTQ",label:"Martinique"},{id:"MUS",label:"Mauritius"},{id:"MWI",label:"Malawi"},{id:"MYS",label:"Malaysia"},{id:"MYT",label:"Mayotte"},{id:"NAM",label:"Namibia"},{id:"NCL",label:"New Caledonia"},{id:"NER",label:"Niger"},{id:"NFK",label:"Norfolk Island"},{id:"NGA",label:"Nigeria"},{id:"NIC",label:"Nicaragua"},{id:"NIU",label:"Niue"},{id:"NLD",label:"Netherlands"},{id:"NOR",label:"Norway"},{id:"NPL",label:"Nepal"},{id:"NRU",label:"Nauru"},{id:"NZL",label:"New Zealand"},{id:"OMN",label:"Oman"},{id:"PAK",label:"Pakistan"},{id:"PAN",label:"Panama"},{id:"PCN",label:"Pitcairn Islands"},{id:"PER",label:"Peru"},{id:"PHL",label:"Philippines"},{id:"PLW",label:"Palau"},{id:"PNG",label:"Papua New Guinea"},{id:"POL",label:"Poland"},{id:"PRI",label:"Puerto Rico"},{id:"PRK",label:"North Korea"},{id:"PRT",label:"Portugal"},{id:"PRY",label:"Paraguay"},{id:"PSE",label:"Palestine"},{id:"PYF",label:"French Polynesia"},{id:"QAT",label:"Qatar"},{id:"REU",label:"R\xe9union"},{id:"ROU",label:"Romania"},{id:"RUS",label:"Russia"},{id:"RWA",label:"Rwanda"},{id:"SAU",label:"Saudi Arabia"},{id:"SDN",label:"Sudan"},{id:"SEN",label:"Senegal"},{id:"SGP",label:"Singapore"},{id:"SGS",label:"South Georgia"},{id:"SJM",label:"Svalbard and Jan Mayen"},{id:"SLB",label:"Solomon Islands"},{id:"SLE",label:"Sierra Leone"},{id:"SLV",label:"El Salvador"},{id:"SMR",label:"San Marino"},{id:"SOM",label:"Somalia"},{id:"SPM",label:"Saint Pierre and Miquelon"},{id:"SRB",label:"Serbia"},{id:"SSD",label:"South Sudan"},{id:"STP",label:"S\xe3o Tom\xe9 and Pr\xedncipe"},{id:"SUR",label:"Suriname"},{id:"SVK",label:"Slovakia"},{id:"SVN",label:"Slovenia"},{id:"SWE",label:"Sweden"},{id:"SWZ",label:"Eswatini"},{id:"SXM",label:"Sint Maarten"},{id:"SYC",label:"Seychelles"},{id:"SYR",label:"Syria"},{id:"TCA",label:"Turks and Caicos Islands"},{id:"TCD",label:"Chad"},{id:"TGO",label:"Togo"},{id:"THA",label:"Thailand"},{id:"TJK",label:"Tajikistan"},{id:"TKL",label:"Tokelau"},{id:"TKM",label:"Turkmenistan"},{id:"TLS",label:"Timor-Leste"},{id:"TON",label:"Tonga"},{id:"TTO",label:"Trinidad and Tobago"},{id:"TUN",label:"Tunisia"},{id:"TUR",label:"Turkey"},{id:"TUV",label:"Tuvalu"},{id:"TWN",label:"Taiwan"},{id:"TZA",label:"Tanzania"},{id:"UGA",label:"Uganda"},{id:"UKR",label:"Ukraine"},{id:"UMI",label:"United States Minor Outlying Islands"},{id:"URY",label:"Uruguay"},{id:"USA",label:"United States"},{id:"UZB",label:"Uzbekistan"},{id:"VAT",label:"Vatican City"},{id:"VCT",label:"Saint Vincent and the Grenadines"},{id:"VEN",label:"Venezuela"},{id:"VGB",label:"British Virgin Islands"},{id:"VIR",label:"United States Virgin Islands"},{id:"VNM",label:"Vietnam"},{id:"VUT",label:"Vanuatu"},{id:"WLF",label:"Wallis and Futuna"},{id:"WSM",label:"Samoa"},{id:"YEM",label:"Yemen"},{id:"ZAF",label:"South Africa"},{id:"ZMB",label:"Zambia"},{id:"ZWE",label:"Zimbabwe"}].map(function(e){return Object(I.a)({},e,{type:_.flag})}),ce=Array.from(Array(500).keys()).map(function(e){return{id:e.toString(),label:"Port ".concat(e),type:_.port}}),se=le.map(function(e){return Object(I.a)({},e,{type:_.after})}),de=le.map(function(e){return Object(I.a)({},e,{type:_.before})});de.push(Object(I.a)({},ie,{type:_.before}));var ue=[].concat(Object(u.a)(re),Object(u.a)(oe),Object(u.a)(ce),Object(u.a)(se),Object(u.a)(de)),be=function(){var e=Object(l.useMemo)(function(){var e=f.a.parse(window.location.search,{ignoreQueryPrefix:!0});return e&&e.search?e.search:[]},[]),a=Object(l.useState)(e),t=Object(b.a)(a,2),i=t[0],r=t[1],o=Object(l.useCallback)(function(e){r(e);var a=f.a.stringify({search:e},{addQueryPrefix:!0}),t=window.location.origin+window.location.pathname+a;window.history.replaceState(window.history.state,"",t)},[]),c=Object(l.useMemo)(function(){return N(i||[])},[i]),s=function(e){r([].concat(Object(u.a)(i),[e]))},d=function(e){r(i.filter(function(a){return a!==e}))},p=function(e){return i.filter(function(a){return a.type===e})};return n.a.createElement("div",{className:g.a.app},n.a.createElement(Z,{staticOptions:ue,selectedItems:i,onChange:o}),n.a.createElement("div",null,n.a.createElement("button",{onClick:function(){r([])}},"Remove selection")),n.a.createElement("div",null,n.a.createElement(ee,{options:oe,selectedItems:p("flag"),onSelectedItem:s,onRemoveItem:d}),n.a.createElement(ee,{options:re,selectedItems:p("rfmo"),onSelectedItem:s,onRemoveItem:d})),n.a.createElement("div",{className:g.a.selectionContainer},n.a.createElement("h2",null,"Current filter selection by"),null!==c?n.a.createElement("ul",{className:g.a.selectionList},Object.keys(_).map(function(e){return n.a.createElement("li",{key:e},n.a.createElement("strong",null,(a=e).charAt(0).toUpperCase()+a.slice(1)),":"," ",void 0!==c[e]?c[e].values.map(function(a,t){return n.a.createElement("span",{key:a.id},e===_.flag&&n.a.createElement(m.a,{iso:a.id}),a.label,"(",a.id,")",t===c[e].values.length-1?"":",")}):n.a.createElement("span",null,"no filter"));var a})):n.a.createElement("span",null,"none")))},me=t(73),pe=t.n(me),fe=function(){return n.a.createElement("div",{className:pe.a.container},n.a.createElement("h2",null,"@erik, feel free to modify names, folder structure and... enjoy hacking!"))},he=function(){return n.a.createElement(o.b,null,n.a.createElement(d,{path:"".concat("/pcp-search-bar","/"),default:!0}),n.a.createElement(be,{path:"".concat("/pcp-search-bar","/search")}),n.a.createElement(fe,{path:"".concat("/pcp-search-bar","/scrolling")}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(n.a.createElement(he,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},33:function(e,a,t){e.exports={selectionContainer:"search_selectionContainer__2_Ddd"}},40:function(e,a,t){e.exports={title:"home_title__3UjmG",nav:"home_nav__2pajt"}},6:function(e,a,t){e.exports={searchContainer:"search_searchContainer__MIOBX",searchInput:"search_searchInput__3QW9t",searchErrorsContainer:"search_searchErrorsContainer__uyGp0",searchItemError:"search_searchItemError__t-Lw7",optionListContainer:"search_optionListContainer__34CUz",optionList:"search_optionList__2xo8Z",optionlistItem:"search_optionlistItem__2AsXx",optionlistItemLoading:"search_optionlistItemLoading__18PZW search_optionlistItem__2AsXx",optionlistItemPlaceholder:"search_optionlistItemPlaceholder__3rSYK",loadingContainer:"search_loadingContainer__1zcWl",spinner:"search_spinner__2Ev9v",spin:"search_spin__3J2Sf"}},73:function(e,a,t){e.exports={container:"history-scroll_container__3k5El"}},76:function(e,a,t){e.exports=t(181)},81:function(e,a,t){},82:function(e,a,t){}},[[76,1,2]]]);
//# sourceMappingURL=main.f02687a3.chunk.js.map