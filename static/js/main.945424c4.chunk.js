(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{136:function(e,t,n){var a=n(144),o=n(233),i=n(236);function c(e){for(var t=new Set,n=a.parse(e,!0).query,i=Object.keys(n),c=0;c<i.length;c++){var s=n[i[c]];o({exact:!0}).test(s)&&t.add(s)}return t}e.exports=function(e,t){t=t||{};var n=new Set,a=function(e){n.add(i(e.trim().replace(/\.+$/,""),t))},s=e.match(o())||[],l=!0,r=!1,u=void 0;try{for(var d,m=s[Symbol.iterator]();!(l=(d=m.next()).done);l=!0){var f=d.value;if(a(f),t.extractFromQueryString){var h=!0,p=!1,g=void 0;try{for(var v,b=c(f)[Symbol.iterator]();!(h=(v=b.next()).done);h=!0){a(v.value)}}catch(E){p=!0,g=E}finally{try{h||null==b.return||b.return()}finally{if(p)throw g}}}}}catch(E){r=!0,u=E}finally{try{l||null==m.return||m.return()}finally{if(r)throw u}}return n}},208:function(e,t,n){e.exports=n(455)},215:function(e,t,n){},216:function(e,t,n){},233:function(e,t,n){var a=n(234),o=n(235);e.exports=function(e){e=Object.assign({strict:!0},e);var t="(?:(?:[a-z]+:)?//)".concat(e.strict?"":"?"),n=a.v4().source,i="(?:\\.".concat(e.strict?"(?:[a-z\\u00a1-\\uffff]{2,})":"(?:".concat(o.sort(function(e,t){return t.length-e.length}).join("|"),")"),")\\.?"),c="(?:".concat(t,"|www\\.)").concat("(?:\\S+(?::\\S*)?@)?","(?:localhost|").concat(n,"|").concat("(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)").concat("(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*").concat(i,")").concat("(?::\\d{2,5})?").concat('(?:[/?#][^\\s"]*)?');return e.exact?new RegExp("(?:^".concat(c,"$)"),"i"):new RegExp(c,"ig")}},447:function(e,t,n){},448:function(e,t,n){},455:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),i=n(28),c=n.n(i),s=n(200),l=(n(215),n(216),n(10)),r=n(13),u=n(15),d=n(14),m=n(16),f=n(30),h=n(53),p=n(19),g=(n(217),n(218),n(219),n(137)),v=n(201),b=n.n(v),E=n(202),w=n.n(E),y=n(461),O=n(2),x=n(456),S=n(462),k=n(457),N=n(139),j=n(134),I=n(76),T=n(136),C=n.n(T),D=function(e){if(null===e)throw new Error("date is null");var t=Object(O.a)(e),n=new Date;return o.a.createElement("span",{title:t.toString()},Object(y.a)(e,n,{addSuffix:!0}))},A=function(e){var t=C()(e.text),n=!0,a=!1,o=void 0;try{for(var i,c=C()(e.notes||"",{stripHash:!1}).values()[Symbol.iterator]();!(n=(i=c.next()).done);n=!0){var s=i.value;t.add(s)}}catch(l){a=!0,o=l}finally{try{n||null==c.return||c.return()}finally{if(a)throw o}}return Array.from(t)},L=function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={saveDisabled:!0,advancedMode:!0,urls:A(n.props.item),newContext:null},n._escapeKey=function(e){e.defaultPrevented||"Escape"===e.key&&n.props.close()},n.itemFormSubmit=function(e){e.preventDefault(),n.itemFormSave()},n.itemFormSave=function(){var e=n.refs.text.value.trim(),t=n.state.advancedMode&&n.refs.notes.value.trim()||null;e?(n.props.edit(n.props.item,e,t,n.state.newContext),n.props.close()):(n.props.delete(n.props.item),n.props.close())},n.onChangeContext=function(e){n.setState({newContext:e},function(){n.itemFormSave()})},n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.refs.text.focus(),window.addEventListener("keydown",this._escapeKey,!0)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("keydown",this._escapeKey,!0)}},{key:"render",value:function(){var e=this,t=this.props.item;return o.a.createElement("div",{className:"modal is-active"},o.a.createElement("div",{className:"modal-background",onClick:function(){e.props.close()}}),o.a.createElement("div",{className:"modal-content"},o.a.createElement("div",{className:"box",style:{margin:0}},o.a.createElement("div",{className:"level is-mobile",style:{marginBottom:20}},o.a.createElement("div",{className:"level-item has-text-centered"},o.a.createElement("button",{type:"button",className:t.done?"button is-warning":"button is-success",onClick:function(){e.props.done(t)}},o.a.createElement(j.a,{icon:t.done?I.d:I.c})," ",t.done?"UNDONE!":"DONE!")),o.a.createElement("div",{className:"level-item has-text-centered"},o.a.createElement("button",{type:"button",className:"button is-link",onClick:function(){e.setState({advancedMode:!e.state.advancedMode})}},this.state.advancedMode?"Less!":"More?")),o.a.createElement("div",{className:"level-item has-text-centered"},o.a.createElement("button",{type:"button",className:"button is-danger",onClick:function(){e.props.delete(t)}},"DELETE"))),o.a.createElement("form",{onSubmit:this.itemFormSubmit},o.a.createElement("input",{className:"input edit-item",type:"text",ref:"text",style:{marginBottom:5},onChange:function(){e.state.saveDisabled&&e.setState({saveDisabled:!1})},defaultValue:t.text})),this.state.advancedMode&&o.a.createElement(_,{onChangeContext:this.onChangeContext,contextOptions:this.props.allContextOptions,currentContext:t.context?t.context:""}),this.state.advancedMode?o.a.createElement("form",{onSubmit:this.itemFormSubmit},o.a.createElement("textarea",{ref:"notes",className:"textarea",placeholder:"Notes...",defaultValue:t.notes||"",onChange:function(){e.state.saveDisabled&&e.setState({saveDisabled:!1})}})):null,this.state.advancedMode&&this.state.urls.length?o.a.createElement("p",null,o.a.createElement("b",null,"URLs:"),this.state.urls.map(function(t){return o.a.createElement("a",{key:t,href:t,target:"_blank",rel:"noopener noreferrer",style:{marginLeft:10,display:e.state.urls.length>1?"block":"inline"}},t)})):null,this.state.urls.length?o.a.createElement("ul",null):null,o.a.createElement("div",{className:"level is-mobile",style:{marginTop:25}},o.a.createElement("div",{className:"level-left"},o.a.createElement("div",{className:"level-item has-text-left"},o.a.createElement("button",{className:"button is-success",onClick:this.itemFormSubmit,disabled:this.state.saveDisabled},"Save"))),o.a.createElement("div",{className:"level-right"},o.a.createElement("div",{className:"level-item has-text-right"},o.a.createElement("button",{className:"button",onClick:function(t){e.props.close()}},"Cancel")))),this.state.advancedMode?o.a.createElement("p",{className:"is-size-6"},t.created!==t.modified?o.a.createElement("span",null,o.a.createElement("b",null,"Edited:")," ",D(t.modified)):o.a.createElement("span",null,o.a.createElement("b",null,"Added:")," ",D(t.created))):null)))}}]),t}(o.a.Component),_=function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={opened:!1,addNew:!1},n.formSubmit=function(e){e.preventDefault();var t=n.refs.newcontext.value.trim();n.props.onChangeContext(t)},n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.contextOptions,a=t.currentContext,i=t.onChangeContext;return o.a.createElement("form",{onSubmit:this.formSubmit,style:{marginBottom:4}},o.a.createElement("div",{className:this.state.opened?"dropdown is-active":"dropdown"},o.a.createElement("div",{className:"dropdown-trigger"},o.a.createElement("button",{type:"button",className:"button","aria-haspopup":"true","aria-controls":"dropdown-menu",onClick:function(t){t.preventDefault();var n=!!e.state.opened;e.setState({opened:!e.state.opened},function(){n&&e.state.addNew&&e.setState({addNew:!1})})}},o.a.createElement("span",null,this.state.opened?"Close":"Move to a different context"),o.a.createElement(j.a,{icon:this.state.opened?I.b:I.a,style:{marginLeft:10}}))),o.a.createElement("div",{className:"dropdown-menu",id:"dropdown-menu",role:"menu"},o.a.createElement("div",{className:"dropdown-content"},n.map(function(e){return o.a.createElement("a",{key:e.name,href:"/",className:a===e.name?"dropdown-item is-active":"dropdown-item",onClick:function(t){t.preventDefault(),i(e.name)}},e.name?o.a.createElement("span",null,e.name," (",e.count,")"):o.a.createElement("i",null,"Default (",e.count,")"))}),o.a.createElement("hr",{className:"dropdown-divider"}),this.state.addNew?o.a.createElement("input",{type:"text",ref:"newcontext",className:"input",placeholder:"My new context name",onChange:function(e){e.preventDefault()},onBlur:function(e){console.log("New input blurred")}}):o.a.createElement("a",{href:"/",className:"dropdown-item",onClick:function(t){t.preventDefault(),e.setState({addNew:!0},function(){e.refs.newcontext.focus()})}},"Create a new context")))))}}]),t}(o.a.PureComponent),P=function(e){var t=e.context,n=e.onClick;return t?o.a.createElement("span",{onClick:n,className:"tag is-dark is-pulled-right"},t):null},M=n(94),R=n(4),U=Object({NODE_ENV:"production",PUBLIC_URL:"",REACT_APP_KINTO_URL:"https://kinto.workon.app/v1"}).REACT_APP_OIDC_CLIENT_ID||"R6R1t40cXQnuPQBdC8D83WOVyuUppZdw",F=Object({NODE_ENV:"production",PUBLIC_URL:"",REACT_APP_KINTO_URL:"https://kinto.workon.app/v1"}).REACT_APP_OIDC_DOMAIN||"peterbecom.auth0.com",B="".concat(window.location.protocol,"//").concat(window.location.host,"/"),W=Object({NODE_ENV:"production",PUBLIC_URL:"",REACT_APP_KINTO_URL:"https://kinto.workon.app/v1"}).REACT_APP_OIDC_CALLBACK_URL||B,J=Object({NODE_ENV:"production",PUBLIC_URL:"",REACT_APP_KINTO_URL:"https://kinto.workon.app/v1"}).REACT_APP_OIDC_AUDIENCE||"https://".concat(F,"/userinfo"),z=n(203),K=n.n(z),V=function e(t){var n=this;Object(l.a)(this,e),this.rootStore=t,this.db=new K.a({adapterOptions:{migrateOldData:!0}}),this.collection=this.db.collection("todos"),Object(R.g)(this,{items:[],deletedItem:null,editItem:null,cleanSlateDate:null,accessToken:null,contextFilter:null,syncLog:{error:null,lastSuccess:null,lastFailure:null},syncLogs:[],obtain:Object(R.d)(function(){return n.collection.list({order:"-created"}).then(function(e){n.items=e.data})}),keepSyncing:Object(R.d)(function(){n.periodicSyncTimer=setTimeout(function(){var e=0;n.syncLog.lastFailure&&(e=n.syncLog.lastFailure),n.syncLog.lastSuccess&&n.syncLog.lastSuccess>e&&(e=n.syncLog.lastSuccess),(new Date).getTime()-e>2e3?n.sync():console.warn("Skipping periodic sync because it was done recently."),n.keepSyncing()},5e3)}),lastModifiedSync:null,sync:Object(R.d)(function(){if(n.accessToken){var e={remote:"https://kinto.workon.app/v1",headers:{Authorization:"Bearer ".concat(n.accessToken)}};n.collection.sync(e).then(function(t){if(t.lastModified!==n.lastModifiedSync&&(n.obtain(),n.lastModifiedSync=t.lastModified),t.ok?n.syncLog.lastSuccess=(new Date).getTime():n.syncLog.lastFailure=(new Date).getTime(),t._date=new Date,n.syncLogs.push(t),n.syncLogs.length>=30&&(n.syncLogs=n.syncLogs.slice(n.syncLogs.length-30,n.syncLogs.length)),t.conflicts.length)return console.warn("There are ".concat(t.conflicts.length," conflicts.")),Promise.all(t.conflicts.map(function(e){return n.collection.resolve(e,e.remote)})).then(function(){console.log("Conflicts successfully resolved."),n.collection.sync(e).then(function(){console.log("Server sync successful after conflict resolution.")}).catch(function(e){console.log("Server sync failed.",e)})}).catch(function(e){throw console.warn("Attempt to resolve all conflicts failed.",e),e})}).catch(function(e){if(console.warn("ERROR:",e),e.message.includes("Data provided to an operation does not meet requirements."))throw e;if(e.message.includes("flushed"))return n.collection.resetSyncStatus().then(function(e){n.collection.sync(),alert("Server data flushed. Trying to refresh this page."),window.location.reload()});e.data&&e.data.code&&401===e.data.code&&(n.accessToken=null),n.syncLog.error=e,n.syncLog.lastFailure=(new Date).getTime()})}else console.warn("No accessToken, no remote sync.")}),selfDestruct:Object(R.d)(function(){n.collection.clear().then(function(){n.items=[],n.editItem=null,n.deleteItem=null,n.sync(),alert("It's all gone.")}).catch(function(e){throw e})}),updateItem:Object(R.d)(function(e,t,a,o){var i=n.items.findIndex(function(t){return t.id===e.id}),c=n.items[i];c.text=t,c.notes=a,c.context=o,c.modified=(new Date).getTime(),n.items[i]=c,n.collection.update(n.cleanBeforeUpdating(c)).catch(function(e){throw e}).then(function(){n.sync()})}),addItem:Object(R.d)(function(e){var t=new Date,a={text:e,done:null,created:t.getTime(),modified:t.getTime()};n.collection.create(a).then(function(e){a.id=e.data.id,n.items.unshift(a),n.sync()}).catch(function(e){throw e})}),importItem:Object(R.d)(function(e){n.collection.create(e).then(function(t){e.id=t.data.id,n.items.unshift(e)}).catch(function(e){throw e})}),deleteItem:Object(R.d)(function(e){n.editItem=null;var t=n.items.findIndex(function(t){return t.id===e.id}),a=n.items[t];a.deleted?(a.deleted=null,n.deletedItem=null):(a.deleted=(new Date).getTime(),n.deletedItem=e),n.collection.update(n.cleanBeforeUpdating(a)).then(function(e){n.items[t]=a,n.sync()}).catch(function(e){throw e})}),doneItem:Object(R.d)(function(e){var t=n.items.findIndex(function(t){return t.id===e.id}),a=n.items[t];a.done?a.done=null:a.done=(new Date).getTime(),n.items[t]=a,n.editItem=null,n.collection.update(n.cleanBeforeUpdating(a)).then(function(){n.sync()}).catch(function(e){throw e})}),togglePinnedItem:Object(R.d)(function(e){var t=n.items.findIndex(function(t){return t.id===e.id}),a=n.items[t];a.pinned?a.pinned=null:a.pinned=(new Date).getTime(),n.items[t]=a,n.collection.update(n.cleanBeforeUpdating(a)).then(function(){n.sync()}).catch(function(e){throw e})}),cleanBeforeUpdating:function(e){var t=Object(R.m)(e);return t.last_modified&&delete t.last_modified,t},cleanSlate:Object(R.d)(function(){var e=(new Date).getTime();n.items.forEach(function(t){t.hidden||t.pinned||(t.hidden=e,n.collection.update(n.cleanBeforeUpdating(t)).catch(function(e){throw e}))}),n.cleanSlateDate=e,n.sync()}),undoCleanSlate:Object(R.d)(function(){n.items.forEach(function(e){e.hidden&&(n.cleanSlateDate&&e.hidden===n.cleanSlateDate||!n.cleanSlateDate&&e.hidden)&&(e.hidden=null,n.collection.update(n.cleanBeforeUpdating(e)).catch(function(e){throw e}))}),n.cleanSlateDate=null,n.sync()}),get allContextOptions(){var e={};return this.items.forEach(function(t){var n=t.context?t.context:"";e[n]||(e[n]=0),e[n]++}),Object.entries(e).map(function(e){var t=Object(M.a)(e,2);return{name:t[0],count:t[1]}}).sort(function(e,t){return e.name>t.name?1:t.name>e.name?-1:0})}})},Y=function e(t){Object(l.a)(this,e),this.rootStore=t,Object(R.g)(this,{userInfo:null,serverError:null})},H=window.store=new function e(){Object(l.a)(this,e),this.user=new Y(this),this.todos=new V(this)},q={coin:"./sounds/coin.mp3",bump:"./sounds/bump.mp3",ping:"./sounds/ping.mp3",smash:"./sounds/smash.mp3",dead:"./sounds/dead.mp3",jump:"./sounds/jump.mp3"},X=Object(p.a)(function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={hideDone:JSON.parse(localStorage.getItem("hideDone","false")),showPyros:!1,startInAdvancedMode:!1},n._sounds={},n._loadSound=function(e){return n._sounds[e]?Promise.resolve(n._sounds[e]):w()(q[e]).then(function(t){return n._sounds[e]=t,t})},n.playSound=function(e){if(!q[e])throw new Error("Unrecognized sound '".concat(e,"'."));n._loadSound(e).then(function(){b()(n._sounds[e])})},n.itemFormSubmit=function(e){e.preventDefault();var t=n.refs.new.value.trim();t&&(H.todos.addItem(t),n.refs.new.value="",n.playSound("ping"))},n.showPyrosTemporarily=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5e3;n.setState({showPyros:!0},function(){window.setTimeout(function(){n.dismounted||n.setState({showPyros:!1})},e)})},n.doneItem=function(e){var t=!e.done;H.todos.doneItem(e),t?(n.playSound("coin"),n.showPyrosTemporarily()):n.playSound("bump")},n.deleteItem=function(e){H.todos.deleteItem(e),n.playSound("smash"),n.giveupUndoTimeout&&window.clearTimeout(n.giveupUndoTimeout),n.giveupUndoTimeout=window.setTimeout(function(){n.dismounted||H.todos.deletedItem&&(H.todos.deletedItem=null)},1e4)},n.undoDelete=function(){H.todos.deleteItem(H.todos.deletedItem),n.playSound("ping")},n.undoCleanSlate=function(e){H.todos.undoCleanSlate(),n.playSound("dead")},n.cleanSlate=function(e){H.todos.cleanSlate(),n.playSound("jump")},n.updateItem=function(e,t,n,a){H.todos.updateItem(e,t,n,a)},n.toggleEditItem=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];n.setState({startInAdvancedMode:t},function(){H.todos.editItem=e})},n.togglePinnedItem=function(e){H.todos.togglePinnedItem(e)},n.toggleHideDone=function(e){n.setState({hideDone:!n.state.hideDone},function(){localStorage.setItem("hideDone",JSON.stringify(n.state.hideDone))})},n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"componentDidMount",value:function(){sessionStorage.getItem("notFirstTime")||this.refs.new.focus(),document.title="Things To Work On";var e=/context=(.*)/;if(window.location.hash&&e.test(window.location.hash)){var t=window.location.hash.match(e)[1];H.todos.contextFilter=decodeURIComponent(t)}}},{key:"render",value:function(){var e=this,t={"":0};H.todos.items.forEach(function(e){if(e.context){var n=e.context||"";t[n]||(t[n]=0),t[n]++}t[""]++});var n=Object.keys(t).sort(),a=H.todos.items.filter(function(e){return(!H.todos.contextFilter||e.context===H.todos.contextFilter)&&!e.deleted}),i=a.filter(function(e){return!e.hidden}),c=i.filter(function(t){return!e.state.hideDone||!t.done}),s=i.filter(function(e){return e.done}).length,l=a.length,r=i.length,u=i.map(function(e){return e.created});return o.a.createElement("div",null,o.a.createElement("h1",null,"Things To Work On"),this.state.showPyros?o.a.createElement("div",{className:"pyro"},o.a.createElement("div",{className:"before"}),o.a.createElement("div",{className:"after"})):null,H.todos.deletedItem?o.a.createElement("div",{className:"notification is-warning undo-notification"},o.a.createElement("button",{className:"button is-primary",onClick:this.undoDelete},"Undo Delete")," ",o.a.createElement("button",{className:"button is-small",onClick:function(e){H.todos.deletedItem=null}},"Close")):null,H.todos.cleanSlateDate?o.a.createElement("div",{className:"notification is-warning  undo-notification"},o.a.createElement("button",{className:"delete",onClick:function(e){H.todos.cleanSlateDate=null}}),o.a.createElement("button",{className:"button is-primary",onClick:this.undoCleanSlate},"Undo Clean Slate?")," ",o.a.createElement("button",{className:"button is-small",onClick:function(e){H.todos.cleanSlateDate=null}},"Close")):null,H.todos.editItem?o.a.createElement(L,{item:H.todos.editItem,edit:this.updateItem,close:this.toggleEditItem,delete:this.deleteItem,done:this.doneItem,allContextOptions:H.todos.allContextOptions,startInAdvancedMode:this.state.startInAdvancedMode}):null,o.a.createElement("div",{className:"list-container"},o.a.createElement("form",{onSubmit:this.itemFormSubmit},o.a.createElement("input",{className:"input add-item",type:"text",ref:"new",placeholder:"What's next?"})),n.length>1?o.a.createElement("div",{className:"tabs is-small"},o.a.createElement("ul",null,n.map(function(e){return o.a.createElement("li",{key:e,className:H.todos.contextFilter===e||!H.todos.contextFilter&&!e?"is-active":null},o.a.createElement("a",{href:"#context=".concat(e),onClick:function(t){t.preventDefault(),e?(H.todos.contextFilter=e,window.location.hash="#context=".concat(e)):(H.todos.contextFilter=null,window.location.hash="")}},e||"All"," (",t[e],")"))}))):null,o.a.createElement("div",{className:"list-container-inner"},o.a.createElement(g.TransitionGroup,null,c.map(function(t){return o.a.createElement(g.CSSTransition,{key:t.id||t.created,timeout:300,classNames:"fade"},o.a.createElement($,{item:t,allDates:u,deleteItem:e.deleteItem,doneItem:e.doneItem,editItemText:e.editItemText,setEditItem:e.toggleEditItem,togglePinnedItem:e.togglePinnedItem}))})))),c.length?o.a.createElement("div",{className:"columns buttons"},o.a.createElement("div",{className:"column"},o.a.createElement("button",{className:"button is-info is-fullwidth",onClick:this.cleanSlate},"Clean Slate")),o.a.createElement("div",{className:"column"},o.a.createElement("button",{className:"button is-info is-fullwidth",onClick:this.toggleHideDone},this.state.hideDone?"Show Done Items (".concat(s,")"):"Hide Done Items (".concat(s,")")))):o.a.createElement("p",{className:"freshness-blurb"},"Ahhhhh! The freshness of starting afresh!"),l>r?o.a.createElement("p",null,o.a.createElement("button",{className:"button is-mini is-fullwidth",onClick:function(e){H.todos.undoCleanSlate()}},"Show all (",l-r,") hidden items")):null,o.a.createElement(Q,{syncLog:H.todos.syncLog}))}}]),t}(o.a.Component)),Q=Object(p.a)(function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,i=new Array(a),c=0;c<a;c++)i[c]=arguments[c];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(i)))).subRender=function(e){return e.lastSuccess||e.lastFailure?e.lastSuccess&&!e.lastFailure||e.lastSuccess>e.lastFailure?o.a.createElement(f.b,{to:"/synclog",className:"has-text-success"},"Data backed up"," ",Object(y.a)(e.lastSuccess,new Date,{addSuffix:!0}),"."):e.lastFailure&&!e.lastSuccess||e.lastFailure>e.lastSuccess?o.a.createElement(f.b,{to:"/synclog",className:"has-text-danger"},"Last data backed-up failed"," ",Object(y.a)(e.lastFailure,new Date,{addSuffix:!0}),"."):o.a.createElement("small",null,JSON.stringify(H.todos.syncLog)):o.a.createElement(f.b,{to:"/auth",title:"Authenticate to enable backup",className:"has-text-warning"},"Data ",o.a.createElement("i",null,"not")," backed up.")},n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return o.a.createElement("p",{className:"has-text-centered sync-log-summary"},this.subRender(H.todos.syncLog))}}]),t}(o.a.Component)),$=Object(p.a)(function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={displayMetadata:!1,editMode:!1,newText:null},n.toggleEditMode=function(e){null===n.state.newText&&n.setState({newText:n.props.item.text}),n.setState({editMode:!n.state.editMode},function(){n.state.editMode?n.refs.text.focus():n.props.editItemText(n.state.newText,n.props.item)})},n.handleTextEdit=function(e){n.setState({newText:e.target.value})},n._swipe={},n.minSwipeDistance=100,n.handleTouchStart=function(e){var t=e.touches[0];n._swipe.x=t.clientX,n._swipe.y=t.clientY,n.refs.textcontainer.style["white-space"]="nowrap",n.refs.textcontainer.style.overflow="overlay"},n.handleTouchMove=function(e){if(e.changedTouches&&e.changedTouches.length){var t=e.changedTouches[0],a=t.clientX-n._swipe.x,o=t.clientY-n._swipe.y;(n._swipe.engaged||Math.abs(a)>10&&Math.abs(a)>Math.abs(o))&&(n._swipe.swiping=!0,n._swipe.engaged=!0,n.refs.textcontainer.style["margin-left"]="".concat(a,"px"),Math.abs(a)>150?(n.refs.textcontainer.classList.remove("shake-little"),n.refs.textcontainer.classList.remove("shake"),n.refs.textcontainer.classList.add("shake-hard")):Math.abs(a)>50?(n.refs.textcontainer.classList.remove("shake-little"),n.refs.textcontainer.classList.add("shake"),n.refs.textcontainer.classList.remove("shake-hard")):(n.refs.textcontainer.classList.add("shake-little"),n.refs.textcontainer.classList.remove("shake"),n.refs.textcontainer.classList.remove("shake-hard")))}},n.handleTouchEnd=function(e){var t=e.changedTouches[0].clientX-n._swipe.x,a=Math.abs(t);n._swipe.swiping&&a>n.minSwipeDistance&&(t<0?n.props.deleteItem(n.props.item):n.props.doneItem(n.props.item)),n._swipe={},n.refs.textcontainer.style["margin-left"]="0",n.refs.textcontainer.style["white-space"]="normal",n.refs.textcontainer.style.overflow="unset",n.refs.textcontainer.classList.remove("shake-little"),n.refs.textcontainer.classList.remove("shake"),n.refs.textcontainer.classList.remove("shake-hard")},n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this,t=this.props.item,n=Object(O.a)(t.created),a=Object(O.a)(t.modified),i="";return t.done&&(i="strikeout"),o.a.createElement("div",{className:"item",title:t.created===t.modified?"Added ".concat(n):"Added ".concat(a)},o.a.createElement(G,{datetime:t.created}),o.a.createElement(Z,{pinned:t.pinned,toggle:function(){e.props.togglePinnedItem(t)}}),o.a.createElement(P,{context:t.context,onClick:function(n){n.preventDefault(),e.props.setEditItem(t,!0)}}),o.a.createElement("p",{className:i,title:"Click to edit",style:{cursor:"pointer"},onClick:function(n){e.props.setEditItem(t)},ref:"textcontainer",onTouchStart:this.handleTouchStart,onTouchMove:this.handleTouchMove,onTouchEnd:this.handleTouchEnd},t.text),t.notes?o.a.createElement("p",{className:"metadata item-notes"},o.a.createElement("b",null,"notes: "),t.notes):null)}}]),t}(o.a.Component)),G=function(e){var t,n=e.datetime,a=new Date;return t=Object(x.a)(a,n)?"Today":Object(x.a)(n,Object(S.a)(a,1))?"Yesterday":Object(k.a)(n,Object(N.a)(a),{addSuffix:!0}),o.a.createElement("span",{className:"tag is-white is-pulled-right"},t)};function Z(e){var t=e.pinned,n=e.toggle;return o.a.createElement("a",{href:"/",className:"tag is-white is-pulled-right pin-toggle",title:"Pinned items don't disappear when make a clean slate",onClick:function(e){e.preventDefault(),n()}},t?"Pinned":"Pin?")}n(446);var ee=n(458),te=n(459),ne=n(460),ae=Object(p.a)(function(e){function t(){return Object(l.a)(this,t),Object(u.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){document.title="Things Done"}},{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"render",value:function(){var e=H.todos.items.filter(function(e){return e.done}),t={};e.reverse().forEach(function(e){var n=Object(N.a)(e.done).getTime();t[n]||(t[n]=[]),t[n].push(e)});var n=Object.keys(t).map(function(e){return parseInt(e,10)});n.sort(function(e,t){return e-t});var a=null;return o.a.createElement("div",null,o.a.createElement("h1",null,"Things Done"),o.a.createElement("div",{className:"timeline"},o.a.createElement("header",{className:"timeline-header"},o.a.createElement("span",{className:"tag is-medium is-primary"},"Start")),o.a.createElement("div",{className:"timeline-item"},o.a.createElement("div",{className:"timeline-content"})),n.map(function(e){var n=t[e],i=Object(ee.a)(e),c=null;return a&&Object(te.a)(i,a)||(c=o.a.createElement("header",{className:"timeline-header",key:i},o.a.createElement("span",{className:"tag is-primary"},Object(ne.a)(i,"MMM")))),a=i,[c,o.a.createElement("div",{className:"timeline-item",key:e},o.a.createElement("div",{className:"timeline-marker"}),o.a.createElement("div",{className:"timeline-content"},o.a.createElement("p",{className:"heading"},oe(e)),n.map(function(e){return o.a.createElement("p",{key:e.id},e.text)})))]}),o.a.createElement("div",{className:"timeline-header"},o.a.createElement("span",{className:"tag is-medium is-primary"},"End"))))}}]),t}(o.a.Component)),oe=function(e){var t=new Date;return Object(x.a)(t,e)?"Today":Object(x.a)(e,Object(S.a)(t,1))?"Yesterday":Object(ne.a)(e,"D MMM YYYY")},ie=Object(p.a)(function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).pageTitle="Authentication",n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){document.title=this.pageTitle}},{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h1",null,this.pageTitle),H.user.serverError?o.a.createElement(ce,{error:H.user.serverError,close:function(e){H.user.serverError=null}}):null,o.a.createElement("p",{style:{textAlign:"center"}},H.user.userInfo?o.a.createElement("button",{className:"button is-large is-warning",onClick:this.props.logOut},"Log Out"):o.a.createElement("button",{className:"button is-large is-primary",onClick:this.props.logIn},"Log In")),H.user.userInfo?o.a.createElement("div",{className:"box"},o.a.createElement("h2",null,"Logged in as: ",o.a.createElement("code",null,H.user.userInfo.email))):null)}}]),t}(o.a.Component));function ce(e){var t=e.close,n=e.error;return o.a.createElement("div",{className:"notification is-warning",style:{margin:30}},o.a.createElement("button",{className:"delete",onClick:t}),o.a.createElement("p",null,o.a.createElement("b",null,"Authentication Server Error")),o.a.createElement("p",null,"Tried to authenticate (or fetch authentication information) and it failed due to a server error."),n.status?o.a.createElement("p",null,"Status code ",o.a.createElement("code",null,n.status)):o.a.createElement("pre",null,JSON.stringify(n)))}var se=Object(p.a)(function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={},n.pageTitle="Settings",n.getVersionData=function(){var e=document.querySelector("#_version");return Object.assign({},e.dataset)},n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){document.title=this.pageTitle}},{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"render",value:function(){var e=this.getVersionData();return o.a.createElement("div",null,o.a.createElement("h1",null,this.pageTitle),o.a.createElement(le,null),o.a.createElement("p",{style:{textAlign:"center"}},"Current version:"," ",o.a.createElement("a",{href:"https://github.com/peterbe/workon/commit/".concat(e.commit),title:e.date},e.commit.slice(0,7))," ",o.a.createElement("small",null,"(",Object(y.a)(e.date,new Date,{addSuffix:!0}),")")," ",o.a.createElement("a",{href:"https://whatsdeployed.io/s/58R",rel:"noopener noreferrer",target:"_blank"},"Whatsdeployed?")))}}]),t}(o.a.Component));function le(){var e=o.a.useState(!1),t=Object(M.a)(e,2),n=t[0],a=t[1];return o.a.createElement("div",{className:"box"},n?o.a.createElement("h4",{className:"has-text-centered"},"This will delete all items forever."):null,o.a.createElement("button",{className:n?"button is-danger is-fullwidth":"button is-warning is-fullwidth",onClick:function(e){n?(H.todos.selfDestruct(),a(!1)):a(!0)},type:"button"},n?"Are you certain?":"Delete it All!"))}var re=Object(p.a)(function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={},n.pageTitle="Sync Log",n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){document.title=this.pageTitle}},{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h1",{className:"title"},this.pageTitle),o.a.createElement(ue,{items:H.todos.syncLogs}))}}]),t}(o.a.Component)),ue=o.a.memo(function(e){var t=e.items;return t.length?o.a.createElement("div",null,o.a.createElement("h2",{className:"title"},t.length," Sync Attempts"),t.map(function(e,t){return o.a.createElement(de,{key:e._date,data:e,first:!t})})):o.a.createElement("div",null,"Nothing yet")}),de=function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={expand:n.props.first},n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this,t=Object.assign({},this.props.data),n={fontSize:"80%"};this.state.expand||(n.maxHeight=100,n.borderBottom="1px dashed rgb(140, 140, 140)");var a=t._date;return delete t._date,o.a.createElement("div",{className:"synclog-item",style:{marginTop:15,paddingTop:10,borderTop:"1px solid #ccc"}},o.a.createElement("h4",{className:t.ok?"title is-4 has-text-success":"title is-4 has-text-danger",style:{marginBottom:2}},t.ok?"OK":"Not OK"),o.a.createElement("small",null,"Date:"," ",o.a.createElement("b",null,Object(ne.a)(a,"PPPPpppp")," (",Object(y.a)(a,new Date,{addSuffix:!0}),")")),o.a.createElement("pre",{style:n,onClick:function(t){e.setState({expand:!e.state.expand})}},JSON.stringify(t,null,2)))}}]),t}(o.a.PureComponent),me=(n(447),n(448),n(206)),fe=n(207),he=n.n(fe);window.windExpires=function(e){var t=JSON.parse(localStorage.expiresAt);t-=36e5*e,localStorage.setItem("expiresAt",t)};var pe=function(e){var t=e.location;return o.a.createElement("div",null,o.a.createElement("h3",null,"No match for ",o.a.createElement("code",null,t.pathname)))},ge=Object(p.a)(function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(u.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={loading:!sessionStorage.getItem("notFirstTime")},n._postProcessAuthResult=function(e){if(e){H.user.userInfo=e.idTokenPayload,H.todos.accessToken=e.accessToken,H.todos.sync(),H.todos.keepSyncing();var t=1e3*e.expiresIn+(new Date).getTime();e.state&&delete e.state,localStorage.setItem("authResult",JSON.stringify(e)),localStorage.setItem("expiresAt",JSON.stringify(t))}},n.accessTokenRefreshLoop=function(){var e=JSON.parse(localStorage.getItem("expiresAt")),t=e-(new Date).getTime();console.log("accessToken expires in",Object(y.a)(e,new Date)),(t-=18e5)<0?(console.warn("Time to fresh the auth token!"),n.webAuth.checkSession({},function(e,t){if(e)return"login_required"===e.error?(console.warn("Error in checkSession requires a new login"),n.logIn()):(console.warn("Error trying to checkSession"),console.error(e));n._postProcessAuthResult(t)})):window.setTimeout(function(){n.dismounted||n.accessTokenRefreshLoop()},3e5)},n.logIn=function(){n.webAuth.authorize({state:""})},n.logOut=function(){localStorage.removeItem("expiresAt"),localStorage.removeItem("authResult"),localStorage.removeItem("userInfo");var e="".concat(window.location.protocol,"//").concat(window.location.host,"/");n.webAuth.logout({returnTo:e,clientID:U})},n}return Object(m.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.state.loading&&(this.stopLoadingTimer=window.setTimeout(function(){e.setState({loading:!1})},1500)),sessionStorage.setItem("notFirstTime",!0),H.todos.obtain(),this.authenticate()}},{key:"componentWillUnmount",value:function(){this.dismounted=!0,this.pullToRefresh&&this.pullToRefresh.destroyAll()}},{key:"authenticate",value:function(){var e=this;this.webAuth=new me.a.WebAuth({domain:F,clientID:U,redirectUri:W,audience:J,responseType:"token id_token",scope:"openid profile email"}),this.webAuth.parseHash({},function(t,n){if(t)return console.error(t);n&&window.location.hash&&(window.location.hash="");var a=!!n;if(!n){(n=JSON.parse(localStorage.getItem("authResult")))&&(a=!0);var o=JSON.parse(localStorage.getItem("expiresAt"));o&&o-(new Date).getTime()<0&&(n=null)}n&&e._postProcessAuthResult(n),a&&e.accessTokenRefreshLoop()})}},{key:"render",value:function(){var e=this;return o.a.createElement(f.a,null,o.a.createElement(he.a,{active:this.state.loading,spinner:!0,background:"rgba(256, 256, 256, 0.92)",color:"#000",spinnerSize:"140px",text:"Loading the app..."},o.a.createElement("div",{className:"container"},o.a.createElement("div",{className:"box"},H.user.userInfo?o.a.createElement(f.b,{to:"auth"},o.a.createElement("figure",{className:"image is-32x32 is-pulled-right avatar",title:"Logged in as ".concat(H.user.userInfo.name,", ").concat(H.user.userInfo.email)},o.a.createElement("img",{src:H.user.userInfo.picture,alt:"Avatar"}))):null,o.a.createElement(h.c,null,o.a.createElement(h.a,{path:"/",exact:!0,component:X}),o.a.createElement(h.a,{path:"/timeline",exact:!0,component:ae}),o.a.createElement(h.a,{path:"/auth",exact:!0,render:function(t){return o.a.createElement(ie,Object.assign({},t,{logIn:e.logIn,logOut:e.logOut}))}}),o.a.createElement(h.a,{path:"/settings",exact:!0,component:se}),o.a.createElement(h.a,{path:"/synclog",exact:!0,component:re}),o.a.createElement(h.a,{component:pe})),o.a.createElement("nav",{className:"breadcrumb is-centered has-bullet-separator","aria-label":"breadcrumbs",style:{marginTop:30,paddingTop:10}},o.a.createElement("ul",null,o.a.createElement("li",null,o.a.createElement(f.b,{to:"/"},"Home")),o.a.createElement("li",null,o.a.createElement(f.b,{to:"/timeline"},"Time Line")),o.a.createElement("li",null,o.a.createElement(f.b,{to:"/auth"},o.a.createElement(ve,{serverError:H.user.serverError,userInfo:H.user.userInfo}))),o.a.createElement("li",null,o.a.createElement(f.b,{to:"/settings"},"Settings"))))))))}}]),t}(o.a.Component)),ve=o.a.memo(function(e){var t=e.serverError,n=e.userInfo,a="has-badge-small has-badge-rounded",i="",c="";return t?(a+=" has-badge-danger",i="!",c="Authentication failed because of a server error"):n?(a+=" has-badge-success",c="Logged in as ".concat(H.user.userInfo.name,", ").concat(H.user.userInfo.email)):(a+=" has-badge-warning",c="You are not logged in so no remote backups can be made."),o.a.createElement("span",{className:a,"data-badge":i,title:c},"Authentication")}),be=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function Ee(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See http://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}c.a.render(o.a.createElement(ge,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat("","/service-worker.js");be?(function(e,t){fetch(e).then(function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):Ee(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit http://bit.ly/CRA-PWA")})):Ee(t,e)})}}({onUpdate:function(e){Object(s.toast)({message:"New version available if you refresh the page.",type:"is-info",dismissible:!0,closeOnClick:!1,pauseOnHover:!0,duration:2e4})}})}},[[208,1,2]]]);
//# sourceMappingURL=main.945424c4.chunk.js.map