(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{162:function(e,t,n){var a=n(171),o=n(278),i=n(281);function c(e){for(var t=new Set,n=a.parse(e,!0).query,i=Object.keys(n),c=0;c<i.length;c++){var r=n[i[c]];o({exact:!0}).test(r)&&t.add(r)}return t}e.exports=function(e,t){t=t||{};var n=new Set,a=function(e){n.add(i(e.trim().replace(/\.+$/,""),t))},r=e.match(o())||[],s=!0,l=!1,u=void 0;try{for(var d,m=r[Symbol.iterator]();!(s=(d=m.next()).done);s=!0){var h=d.value;if(a(h),t.extractFromQueryString){var f=!0,p=!1,v=void 0;try{for(var g,b=c(h)[Symbol.iterator]();!(f=(g=b.next()).done);f=!0){a(g.value)}}catch(E){p=!0,v=E}finally{try{f||null==b.return||b.return()}finally{if(p)throw v}}}}}catch(E){l=!0,u=E}finally{try{s||null==m.return||m.return()}finally{if(l)throw u}}return n}},247:function(e,t,n){e.exports=n(547)},252:function(e,t,n){},254:function(e,t,n){},278:function(e,t,n){var a=n(279),o=n(280);e.exports=function(e){e=Object.assign({strict:!0},e);var t="(?:(?:[a-z]+:)?//)".concat(e.strict?"":"?"),n=a.v4().source,i="(?:\\.".concat(e.strict?"(?:[a-z\\u00a1-\\uffff]{2,})":"(?:".concat(o.sort(function(e,t){return t.length-e.length}).join("|"),")"),")\\.?"),c="(?:".concat(t,"|www\\.)").concat("(?:\\S+(?::\\S*)?@)?","(?:localhost|").concat(n,"|").concat("(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)").concat("(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*").concat(i,")").concat("(?::\\d{2,5})?").concat('(?:[/?#][^\\s"]*)?');return e.exact?new RegExp("(?:^".concat(c,"$)"),"i"):new RegExp(c,"ig")}},532:function(e,t,n){},534:function(e,t,n){},547:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),i=n(38),c=n.n(i),r=(n(252),n(254),n(9)),s=n(11),l=n(13),u=n(12),d=n(14),m=n(555),h=n(548),f=n(557),p=n(558),v=n(23),g=n(235),b=n.n(g),E=(n(257),n(259),n(261),n(161)),w=n(236),y=n.n(w),O=n(237),x=n.n(O),k=n(554),j=n(8),S=n(549),N=n(556),I=n(550),T=n(529),C=n(162),D=n.n(C),A=function(e){if(null===e)throw new Error("date is null");var t=Object(j.a)(e),n=new Date;return o.a.createElement("span",{title:t.toString()},Object(k.a)(e,n,{addSuffix:!0}))},_=function(e){var t=D()(e.text),n=!0,a=!1,o=void 0;try{for(var i,c=D()(e.notes||"").values()[Symbol.iterator]();!(n=(i=c.next()).done);n=!0){var r=i.value;t.add(r)}}catch(s){a=!0,o=s}finally{try{n||null==c.return||c.return()}finally{if(a)throw o}}return Array.from(t)},L=function(e){function t(e){var n;return Object(r.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e)))._escapeKey=function(e){e.defaultPrevented||"Escape"===e.key&&n.props.close()},n.itemFormSubmit=function(e){e.preventDefault(),n.itemFormSave()},n.itemFormSave=function(){var e=n.refs.text.value.trim(),t=n.state.advancedMode&&n.refs.notes.value.trim()||null;e?(n.props.edit(e,t,n.props.item),n.props.close()):(n.props.delete(n.props.item),n.props.close())},n.state={saveDisabled:!0,advancedMode:!!n.props.startInAdvancedMode||n.props.item.notes,urls:_(n.props.item)},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.refs.text.focus(),window.addEventListener("keydown",this._escapeKey,!0)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("keydown",this._escapeKey,!0)}},{key:"render",value:function(){var e=this,t=this.props.item;return o.a.createElement("div",{className:"modal is-active"},o.a.createElement("div",{className:"modal-background",onClick:function(){e.props.close()}}),o.a.createElement("div",{className:"modal-content"},o.a.createElement("div",{className:"box",style:{margin:0}},o.a.createElement("div",{className:"level is-mobile",style:{marginBottom:20}},o.a.createElement("div",{className:"level-item has-text-centered"},o.a.createElement("button",{type:"button",className:t.done?"button is-warning":"button is-success",onClick:function(){e.props.done(t)}},o.a.createElement("span",{role:"img","aria-label":"Toggle done"},"\u2714\ufe0f"),t.done?"UNDONE!":"DONE!")),o.a.createElement("div",{className:"level-item has-text-centered"},o.a.createElement("button",{type:"button",className:"button is-link",onClick:function(){e.setState({advancedMode:!e.state.advancedMode})}},this.state.advancedMode?"Less!":"More?")),o.a.createElement("div",{className:"level-item has-text-centered"},o.a.createElement("button",{type:"button",className:"button is-danger",onClick:function(){e.props.delete(t)}},"DELETE"))),o.a.createElement("form",{onSubmit:this.itemFormSubmit},o.a.createElement("input",{className:"input edit-item",type:"text",ref:"text",style:{marginBottom:5},onChange:function(){e.state.saveDisabled&&e.setState({saveDisabled:!1})},defaultValue:t.text})),this.state.advancedMode&&o.a.createElement(M,{onChangeContext:function(t){e.props.move(t,e.props.item),e.itemFormSave()},contextOptions:this.props.allContextOptions,currentContext:t.context?t.context:""}),this.state.advancedMode?o.a.createElement("form",{onSubmit:this.itemFormSubmit},o.a.createElement("textarea",{ref:"notes",className:"textarea",placeholder:"Notes...",defaultValue:t.notes||"",onChange:function(){e.state.saveDisabled&&e.setState({saveDisabled:!1})}})):null,this.state.advancedMode&&this.state.urls.length?o.a.createElement("p",null,o.a.createElement("b",null,"URLs:"),this.state.urls.map(function(t){return o.a.createElement("a",{key:t,href:t,target:"_blank",rel:"noopener noreferrer",style:{marginLeft:10,display:e.state.urls.length>1?"block":"inline"}},t)})):null,this.state.urls.length?o.a.createElement("ul",null):null,o.a.createElement("div",{className:"level is-mobile",style:{marginTop:25}},o.a.createElement("div",{className:"level-left"},o.a.createElement("div",{className:"level-item has-text-left"},o.a.createElement("button",{className:"button is-success",onClick:this.itemFormSubmit,disabled:this.state.saveDisabled},"Save"))),o.a.createElement("div",{className:"level-right"},o.a.createElement("div",{className:"level-item has-text-right"},o.a.createElement("button",{className:"button",onClick:function(t){e.props.close()}},"Cancel")))),this.state.advancedMode?o.a.createElement("p",{className:"is-size-6"},t.created!==t.modified?o.a.createElement("span",null,o.a.createElement("b",null,"Edited:")," ",A(t.modified)):o.a.createElement("span",null,o.a.createElement("b",null,"Added:")," ",A(t.created))):null)))}}]),t}(o.a.Component),M=function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={opened:!1,addNew:!1},n.formSubmit=function(e){e.preventDefault();var t=n.refs.newcontext.value.trim();n.props.onChangeContext(t)},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this;return o.a.createElement("form",{onSubmit:this.formSubmit,style:{marginBottom:4}},o.a.createElement("div",{className:this.state.opened?"dropdown is-active":"dropdown"},o.a.createElement("div",{className:"dropdown-trigger"},o.a.createElement("button",{type:"button",className:"button","aria-haspopup":"true","aria-controls":"dropdown-menu",onClick:function(t){t.preventDefault();var n=!!e.state.opened;e.setState({opened:!e.state.opened},function(){n&&e.state.addNew&&e.setState({addNew:!1})})}},o.a.createElement("span",null,this.state.opened?"Close":"Move to a different context"),o.a.createElement("span",{className:"icon is-small"},o.a.createElement("i",{className:"fas fa-angle-down","aria-hidden":"true"})))),o.a.createElement("div",{className:"dropdown-menu",id:"dropdown-menu",role:"menu"},o.a.createElement("div",{className:"dropdown-content"},this.props.contextOptions.map(function(t){return o.a.createElement("a",{key:t.name,href:"/",className:e.props.currentContext===t.name?"dropdown-item is-active":"dropdown-item",onClick:function(n){n.preventDefault(),e.props.onChangeContext(t.name)}},t.name?o.a.createElement("span",null,t.name," (",t.count,")"):o.a.createElement("i",null,"Default (",t.count,")"))}),o.a.createElement("hr",{className:"dropdown-divider"}),this.state.addNew?o.a.createElement("input",{type:"text",ref:"newcontext",className:"input",placeholder:"My new context name",onChange:function(e){e.preventDefault()},onBlur:function(e){console.log("New input blurred")}}):o.a.createElement("a",{href:"/",className:"dropdown-item",onClick:function(t){t.preventDefault(),e.setState({addNew:!0},function(){e.refs.newcontext.focus()})}},"Create a new context")))))}}]),t}(o.a.PureComponent),P=function(e){var t=e.context,n=e.onClick;return t?o.a.createElement("span",{onClick:n,className:"tag is-dark is-pulled-right"},t):null},R=n(245),U=n(4),F=Object({NODE_ENV:"production",PUBLIC_URL:"",REACT_APP_KINTO_URL:"https://kinto.workon.app/v1"}).REACT_APP_OIDC_CLIENT_ID||"R6R1t40cXQnuPQBdC8D83WOVyuUppZdw",W=Object({NODE_ENV:"production",PUBLIC_URL:"",REACT_APP_KINTO_URL:"https://kinto.workon.app/v1"}).REACT_APP_OIDC_DOMAIN||"peterbecom.auth0.com",B="".concat(window.location.protocol,"//").concat(window.location.host,"/"),J=Object({NODE_ENV:"production",PUBLIC_URL:"",REACT_APP_KINTO_URL:"https://kinto.workon.app/v1"}).REACT_APP_OIDC_CALLBACK_URL||B,z=Object({NODE_ENV:"production",PUBLIC_URL:"",REACT_APP_KINTO_URL:"https://kinto.workon.app/v1"}).REACT_APP_OIDC_AUDIENCE||"https://".concat(W,"/userinfo"),K=n(238),Y=n.n(K),V=function e(t){var n=this;Object(r.a)(this,e),this.rootStore=t,this.db=new Y.a({adapterOptions:{migrateOldData:!0}}),this.collection=this.db.collection("todos"),Object(U.g)(this,{items:[],deletedItem:null,editItem:null,cleanSlateDate:null,accessToken:null,contextFilter:null,syncLog:{error:null,lastSuccess:null,lastFailure:null},syncLogs:[],obtain:Object(U.d)(function(){return n.collection.list({order:"-created"}).then(function(e){n.items=e.data})}),sync:Object(U.d)(function(){if(n.accessToken){var e={remote:"https://kinto.workon.app/v1",headers:{Authorization:"Bearer ".concat(n.accessToken)}};n.collection.sync(e).then(function(t){if(t.ok?n.syncLog.lastSuccess=(new Date).getTime():n.syncLog.lastFailure=(new Date).getTime(),t._date=new Date,n.syncLogs.push(t),t.conflicts.length)return Promise.all(t.conflicts.map(function(e){return n.collection.resolve(e,e.remote)})).then(function(){n.collection.sync(e)})}).catch(function(e){if(console.warn("ERROR:",e),e.message.includes("flushed"))return n.collection.resetSyncStatus().then(function(e){n.collection.sync(),alert("Server data flushed. Trying to refresh this page."),window.location.reload()});e.data&&e.data.code&&401===e.data.code&&(n.accessToken=null),n.syncLog.error=e,n.syncLog.lastFailure=(new Date).getTime()})}else console.warn("No accessToken, no remote sync.")}),selfDestruct:Object(U.d)(function(){n.collection.clear().then(function(){n.items=[],n.editItem=null,n.deleteItem=null,n.sync(),alert("It's all gone.")}).catch(function(e){throw e})}),editItemText:Object(U.d)(function(e,t,a){var o=n.items.findIndex(function(t){return t.id===e.id}),i=n.items[o];i.text=t,i.notes=a,i.modified=(new Date).getTime(),n.items[o]=i,n.collection.update(i).catch(function(e){throw e}),n.sync()}),editItemContext:Object(U.d)(function(e,t){var a=n.items.findIndex(function(t){return t.id===e.id}),o=n.items[a];o.context=t,n.items[a]=o,n.collection.update(o).catch(function(e){throw e}),n.sync()}),addItem:Object(U.d)(function(e){var t=new Date,a={text:e,done:null,created:t.getTime(),modified:t.getTime()};n.collection.create(a).then(function(e){a.id=e.data.id,n.items.unshift(a),n.sync()}).catch(function(e){throw e})}),importItem:Object(U.d)(function(e){n.collection.create(e).then(function(t){e.id=t.data.id,n.items.unshift(e)}).catch(function(e){throw e})}),deleteItem:Object(U.d)(function(e){n.editItem=null;var t=n.items.findIndex(function(t){return t.id===e.id}),a=n.items[t];a.deleted?(a.deleted=null,n.deletedItem=null):(a.deleted=(new Date).getTime(),n.deletedItem=e),n.collection.update(a).then(function(e){n.items[t]=a,n.sync()}).catch(function(e){throw e})}),doneItem:Object(U.d)(function(e){var t=n.items.findIndex(function(t){return t.id===e.id}),a=n.items[t];a.done?a.done=null:a.done=(new Date).getTime(),n.items[t]=a,n.editItem=null,n.collection.update(a).then(function(){n.sync()}).catch(function(e){throw e})}),cleanSlate:Object(U.d)(function(){var e=(new Date).getTime();n.items.forEach(function(t){t.hidden||(t.hidden=e,n.collection.update(t).catch(function(e){throw e}))}),n.cleanSlateDate=e,n.sync()}),undoCleanSlate:Object(U.d)(function(){n.items.forEach(function(e){e.hidden&&(n.cleanSlateDate&&e.hidden===n.cleanSlateDate||!n.cleanSlateDate&&e.hidden)&&(e.hidden=null,n.collection.update(e).catch(function(e){throw e}))}),n.cleanSlateDate=null,n.sync()}),get allContextOptions(){var e={};return this.items.forEach(function(t){var n=t.context?t.context:"";e[n]||(e[n]=0),e[n]++}),Object.entries(e).map(function(e){var t=Object(R.a)(e,2);return{name:t[0],count:t[1]}}).sort(function(e,t){return e.name>t.name?1:t.name>e.name?-1:0})}})},H=function e(t){Object(r.a)(this,e),this.rootStore=t,Object(U.g)(this,{userInfo:null,serverError:null})},Q=window.store=new function e(){Object(r.a)(this,e),this.user=new H(this),this.todos=new V(this)},X={coin:"./sounds/coin.mp3",bump:"./sounds/bump.mp3",ping:"./sounds/ping.mp3",smash:"./sounds/smash.mp3",dead:"./sounds/dead.mp3",jump:"./sounds/jump.mp3"},$=Object(v.a)(function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={hideDone:JSON.parse(localStorage.getItem("hideDone","false")),showPyros:!1,startInAdvancedMode:!1},n._sounds={},n._loadSound=function(e){return n._sounds[e]?Promise.resolve(n._sounds[e]):x()(X[e]).then(function(t){return n._sounds[e]=t,t})},n.playSound=function(e){if(!X[e])throw new Error("Unrecognized sound '".concat(e,"'."));n._loadSound(e).then(function(){y()(n._sounds[e])})},n.itemFormSubmit=function(e){e.preventDefault();var t=n.refs.new.value.trim();t&&(Q.todos.addItem(t),n.refs.new.value="",n.playSound("ping"))},n.showPyrosTemporarily=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5e3;n.setState({showPyros:!0},function(){window.setTimeout(function(){n.dismounted||n.setState({showPyros:!1})},e)})},n.doneItem=function(e){var t=!e.done;Q.todos.doneItem(e),t?(n.playSound("coin"),n.showPyrosTemporarily()):n.playSound("bump")},n.deleteItem=function(e){Q.todos.deleteItem(e),n.playSound("smash"),n.giveupUndoTimeout&&window.clearTimeout(n.giveupUndoTimeout),n.giveupUndoTimeout=window.setTimeout(function(){n.dismounted||Q.todos.deletedItem&&(Q.todos.deletedItem=null)},1e4)},n.undoDelete=function(){Q.todos.deleteItem(Q.todos.deletedItem),n.playSound("ping")},n.undoCleanSlate=function(e){Q.todos.undoCleanSlate(),n.playSound("dead")},n.cleanSlate=function(e){Q.todos.cleanSlate(),n.playSound("jump")},n.editItemText=function(e,t,n){Q.todos.editItemText(n,e,t)},n.editItemContext=function(e,t){Q.todos.editItemContext(t,e)},n.toggleEditItem=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];n.setState({startInAdvancedMode:t},function(){Q.todos.editItem=e})},n.toggleHideDone=function(e){n.setState({hideDone:!n.state.hideDone},function(){localStorage.setItem("hideDone",JSON.stringify(n.state.hideDone))})},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"componentDidMount",value:function(){sessionStorage.getItem("notFirstTime")||this.refs.new.focus(),document.title="Things To Work On";var e=/context=(.*)/;if(window.location.hash&&e.test(window.location.hash)){var t=window.location.hash.match(e)[1];Q.todos.contextFilter=decodeURIComponent(t)}}},{key:"render",value:function(){var e=this,t={"":0};Q.todos.items.forEach(function(e){if(e.context){var n=e.context||"";t[n]||(t[n]=0),t[n]++}t[""]++});var n=Object.keys(t).sort(),a=Q.todos.items.filter(function(e){return(!Q.todos.contextFilter||e.context===Q.todos.contextFilter)&&!e.deleted}),i=a.filter(function(e){return!e.hidden}),c=i.filter(function(t){return!e.state.hideDone||!t.done}),r=i.filter(function(e){return e.done}).length,s=a.length,l=i.length,u=i.map(function(e){return e.created});return o.a.createElement("div",null,o.a.createElement("h1",null,"Things To Work On"),this.state.showPyros?o.a.createElement("div",{className:"pyro"},o.a.createElement("div",{className:"before"}),o.a.createElement("div",{className:"after"})):null,Q.todos.deletedItem?o.a.createElement("div",{className:"notification is-warning undo-notification"},o.a.createElement("button",{className:"button is-primary",onClick:this.undoDelete},"Undo Delete")," ",o.a.createElement("button",{className:"button is-small",onClick:function(e){Q.todos.deletedItem=null}},"Close")):null,Q.todos.cleanSlateDate?o.a.createElement("div",{className:"notification is-warning  undo-notification"},o.a.createElement("button",{className:"delete",onClick:function(e){Q.todos.cleanSlateDate=null}}),o.a.createElement("button",{className:"button is-primary",onClick:this.undoCleanSlate},"Undo Clean Slate?")," ",o.a.createElement("button",{className:"button is-small",onClick:function(e){Q.todos.cleanSlateDate=null}},"Close")):null,Q.todos.editItem?o.a.createElement(L,{item:Q.todos.editItem,edit:this.editItemText,move:this.editItemContext,close:this.toggleEditItem,delete:this.deleteItem,done:this.doneItem,allContextOptions:Q.todos.allContextOptions,startInAdvancedMode:this.state.startInAdvancedMode}):null,o.a.createElement("div",{className:"list-container"},o.a.createElement("form",{onSubmit:this.itemFormSubmit},o.a.createElement("input",{className:"input add-item",type:"text",ref:"new",placeholder:"What's next?"})),n.length>1?o.a.createElement("div",{className:"tabs is-small"},o.a.createElement("ul",null,n.map(function(e){return o.a.createElement("li",{key:e,className:Q.todos.contextFilter===e||!Q.todos.contextFilter&&!e?"is-active":null},o.a.createElement("a",{href:"#context=".concat(e),onClick:function(t){t.preventDefault(),e?(Q.todos.contextFilter=e,window.location.hash="#context=".concat(e)):(Q.todos.contextFilter=null,window.location.hash="")}},e||"All"," (",t[e],")"))}))):null,o.a.createElement("div",{className:"list-container-inner"},o.a.createElement(E.TransitionGroup,null,c.map(function(t){return o.a.createElement(E.CSSTransition,{key:t.id||t.created,timeout:300,classNames:"fade"},o.a.createElement(G,{item:t,allDates:u,deleteItem:e.deleteItem,doneItem:e.doneItem,editItemText:e.editItemText,setEditItem:e.toggleEditItem}))})))),c.length?o.a.createElement("div",{className:"columns"},o.a.createElement("div",{className:"column"},o.a.createElement("button",{className:"button is-info is-fullwidth",onClick:this.cleanSlate},"Clean Slate")),o.a.createElement("div",{className:"column"},o.a.createElement("button",{className:"button is-info is-fullwidth",onClick:this.toggleHideDone},this.state.hideDone?"Show Done Items (".concat(r,")"):"Hide Done Items (".concat(r,")")))):o.a.createElement("p",{className:"freshness-blurb"},"Ahhhhh! The freshness of starting afresh!"),s>l?o.a.createElement("p",null,o.a.createElement("button",{className:"button is-mini is-fullwidth",onClick:function(e){Q.todos.undoCleanSlate()}},"Show all (",s-l,") hidden items")):null,o.a.createElement(q,{syncLog:Q.todos.syncLog}))}}]),t}(o.a.Component)),q=Object(v.a)(function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,i=new Array(a),c=0;c<a;c++)i[c]=arguments[c];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(i)))).subRender=function(e){return e.lastSuccess||e.lastFailure?e.lastSuccess&&!e.lastFailure||e.lastSuccess>e.lastFailure?o.a.createElement(h.a,{to:"/synclog",className:"has-text-success"},"Data backed up"," ",Object(k.a)(e.lastSuccess,new Date,{addSuffix:!0}),"."):e.lastFailure&&!e.lastSuccess||e.lastFailure>e.lastSuccess?o.a.createElement(h.a,{to:"/synclog",className:"has-text-danger"},"Last data backed-up failed"," ",Object(k.a)(e.lastFailure,new Date,{addSuffix:!0}),"."):o.a.createElement("small",null,JSON.stringify(Q.todos.syncLog)):o.a.createElement(h.a,{to:"/auth",title:"Authenticate to enable backup",className:"has-text-warning"},"Data ",o.a.createElement("i",null,"not")," backed up.")},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return o.a.createElement("p",{className:"has-text-centered"},this.subRender(Q.todos.syncLog))}}]),t}(o.a.Component)),G=Object(v.a)(function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={displayMetadata:!1,editMode:!1,newText:null},n.toggleEditMode=function(e){null===n.state.newText&&n.setState({newText:n.props.item.text}),n.setState({editMode:!n.state.editMode},function(){n.state.editMode?n.refs.text.focus():n.props.editItemText(n.state.newText,n.props.item)})},n.handleTextEdit=function(e){n.setState({newText:e.target.value})},n._swipe={},n.minSwipeDistance=100,n.handleTouchStart=function(e){var t=e.touches[0];n._swipe.x=t.clientX,n._swipe.y=t.clientY,n.refs.textcontainer.style["white-space"]="nowrap",n.refs.textcontainer.style.overflow="overlay"},n.handleTouchMove=function(e){if(e.changedTouches&&e.changedTouches.length){var t=e.changedTouches[0],a=t.clientX-n._swipe.x,o=t.clientY-n._swipe.y;(n._swipe.engaged||Math.abs(a)>10&&Math.abs(a)>Math.abs(o))&&(n._swipe.swiping=!0,n._swipe.engaged=!0,n.refs.textcontainer.style["margin-left"]="".concat(a,"px"),Math.abs(a)>150?(n.refs.textcontainer.classList.remove("shake-little"),n.refs.textcontainer.classList.remove("shake"),n.refs.textcontainer.classList.add("shake-hard")):Math.abs(a)>50?(n.refs.textcontainer.classList.remove("shake-little"),n.refs.textcontainer.classList.add("shake"),n.refs.textcontainer.classList.remove("shake-hard")):(n.refs.textcontainer.classList.add("shake-little"),n.refs.textcontainer.classList.remove("shake"),n.refs.textcontainer.classList.remove("shake-hard")))}},n.handleTouchEnd=function(e){var t=e.changedTouches[0].clientX-n._swipe.x,a=Math.abs(t);n._swipe.swiping&&a>n.minSwipeDistance&&(t<0?n.props.deleteItem(n.props.item):n.props.doneItem(n.props.item)),n._swipe={},n.refs.textcontainer.style["margin-left"]="0",n.refs.textcontainer.style["white-space"]="normal",n.refs.textcontainer.style.overflow="unset",n.refs.textcontainer.classList.remove("shake-little"),n.refs.textcontainer.classList.remove("shake"),n.refs.textcontainer.classList.remove("shake-hard")},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=this.props.item,n=Object(j.a)(t.created),a=Object(j.a)(t.modified),i="";return t.done&&(i="strikeout"),o.a.createElement("div",{className:"item",title:t.created===t.modified?"Added ".concat(n):"Added ".concat(a)},o.a.createElement(Z,{datetime:t.created}),o.a.createElement(P,{context:t.context,onClick:function(n){n.preventDefault(),e.props.setEditItem(t,!0)}}),o.a.createElement("p",{className:i,title:"Click to edit",style:{cursor:"pointer"},onClick:function(n){e.props.setEditItem(t)},ref:"textcontainer",onTouchStart:this.handleTouchStart,onTouchMove:this.handleTouchMove,onTouchEnd:this.handleTouchEnd},t.text),t.notes?o.a.createElement("p",{className:"metadata item-notes"},o.a.createElement("b",null,"notes: "),t.notes):null)}}]),t}(o.a.Component)),Z=function(e){var t,n=e.datetime,a=new Date;return t=Object(S.a)(a,n)?"Today":Object(S.a)(n,Object(N.a)(a,1))?"Yesterday":Object(I.a)(n,Object(T.a)(a),{addSuffix:!0}),o.a.createElement("span",{className:"tag is-white is-pulled-right"},t)},ee=(n(530),n(551)),te=n(552),ne=n(553),ae=Object(v.a)(function(e){function t(){return Object(r.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){document.title="Things Done"}},{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"render",value:function(){var e=Q.todos.items.filter(function(e){return e.done}),t={};e.reverse().forEach(function(e){var n=Object(T.a)(e.done).getTime();t[n]||(t[n]=[]),t[n].push(e)});var n=Object.keys(t).map(function(e){return parseInt(e,10)});n.sort(function(e,t){return e-t});var a=null;return o.a.createElement("div",null,o.a.createElement("h1",null,"Things Done"),o.a.createElement("div",{className:"timeline"},o.a.createElement("header",{className:"timeline-header"},o.a.createElement("span",{className:"tag is-medium is-primary"},"Start")),o.a.createElement("div",{className:"timeline-item"},o.a.createElement("div",{className:"timeline-content"})),n.map(function(e){var n=t[e],i=Object(ee.a)(e),c=null;return a&&Object(te.a)(i,a)||(c=o.a.createElement("header",{className:"timeline-header",key:i},o.a.createElement("span",{className:"tag is-primary"},Object(ne.a)(i,"MMM")))),a=i,[c,o.a.createElement("div",{className:"timeline-item",key:e},o.a.createElement("div",{className:"timeline-marker"}),o.a.createElement("div",{className:"timeline-content"},o.a.createElement("p",{className:"heading"},oe(e)),n.map(function(e){return o.a.createElement("p",{key:e.id},e.text)})))]}),o.a.createElement("div",{className:"timeline-header"},o.a.createElement("span",{className:"tag is-medium is-primary"},"End"))))}}]),t}(o.a.Component)),oe=function(e){var t=new Date;return Object(S.a)(t,e)?"Today":Object(S.a)(e,Object(N.a)(t,1))?"Yesterday":Object(ne.a)(e,"D MMM YYYY")},ie=Object(v.a)(function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).pageTitle="Authentication",n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){document.title=this.pageTitle}},{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h1",null,this.pageTitle),Q.user.serverError?o.a.createElement(ce,{error:Q.user.serverError,close:function(e){Q.user.serverError=null}}):null,o.a.createElement("p",{style:{textAlign:"center"}},Q.user.userInfo?o.a.createElement("button",{className:"button is-large is-warning",onClick:this.props.logOut},"Log Out"):o.a.createElement("button",{className:"button is-large is-primary",onClick:this.props.logIn},"Log In")),Q.user.userInfo?o.a.createElement("div",{className:"box"},o.a.createElement("h2",null,"Logged in as: ",o.a.createElement("code",null,Q.user.userInfo.email))):null)}}]),t}(o.a.Component)),ce=function(e){function t(){return Object(r.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"notification is-warning",style:{margin:30}},o.a.createElement("button",{className:"delete",onClick:this.props.close}),o.a.createElement("p",null,o.a.createElement("b",null,"Authentication Server Error")),o.a.createElement("p",null,"Tried to authenticate (or fetch authentication information) and it failed due to a server error."),this.props.error.status?o.a.createElement("p",null,"Status code ",o.a.createElement("code",null,this.props.error.status)):o.a.createElement("pre",null,JSON.stringify(this.props.error)))}}]),t}(o.a.PureComponent),re=Object(v.a)(function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={},n.pageTitle="Settings",n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){document.title=this.pageTitle}},{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h1",null,this.pageTitle),o.a.createElement(se,null))}}]),t}(o.a.Component)),se=function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={confirm:!1},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this;return o.a.createElement("div",{className:"box"},this.state.confirm?o.a.createElement("h4",{className:"has-text-centered"},"This will delete all items forever."):null,o.a.createElement("button",{type:"button",className:this.state.confirm?"button is-danger is-fullwidth":"button is-warning is-fullwidth",onClick:function(t){e.state.confirm?(Q.todos.selfDestruct(),e.setState({confirm:!1})):e.setState({confirm:!0})}},this.state.confirm?"Are you certain?":"Delete it All!"))}}]),t}(o.a.PureComponent),le=Object(v.a)(function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={},n.pageTitle="Sync Log",n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){document.title=this.pageTitle}},{key:"componentWillUnmount",value:function(){this.dismounted=!0}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h1",{className:"title"},this.pageTitle),o.a.createElement(ue,{items:Q.todos.syncLogs}))}}]),t}(o.a.Component)),ue=function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this.props.items;return e.length?o.a.createElement("div",null,o.a.createElement("h2",{className:"title"},e.length," Sync Attempts"),e.map(function(e,t){return o.a.createElement(de,{key:e.lastModified,data:e,first:!t})})):o.a.createElement("div",null,"Nothing yet")}}]),t}(o.a.PureComponent),de=function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={expand:n.props.first},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this,t=Object.assign({},this.props.data),n={fontSize:"80%"};this.state.expand||(n.maxHeight=100,n.borderBottom="1px dashed rgb(140, 140, 140)");var a=t._date;return delete t._date,o.a.createElement("div",{className:"synclog-item",style:{marginTop:15,paddingTop:10,borderTop:"1px solid #ccc"}},o.a.createElement("h4",{className:t.ok?"title is-4 has-text-success":"title is-4 has-text-danger",style:{marginBottom:2}},t.ok?"OK":"Not OK"),o.a.createElement("small",null,"Date:"," ",o.a.createElement("b",null,Object(ne.a)(a,"PPPPpppp")," (",Object(k.a)(a,new Date,{addSuffix:!0}),")")),o.a.createElement("pre",{style:n,onClick:function(t){e.setState({expand:!e.state.expand})}},JSON.stringify(t,null,2)))}}]),t}(o.a.PureComponent),me=(n(532),n(534),n(239)),he=n(240),fe=n.n(he);window.windExpires=function(e){var t=JSON.parse(localStorage.expiresAt);t-=36e5*e,localStorage.setItem("expiresAt",t)};var pe=function(e){var t=e.location;return o.a.createElement("div",null,o.a.createElement("h3",null,"No match for ",o.a.createElement("code",null,t.pathname)))},ve=Object(v.a)(function(e){function t(){var e,n;Object(r.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={loading:!sessionStorage.getItem("notFirstTime")},n._postProcessAuthResult=function(e){if(e){Q.user.userInfo=e.idTokenPayload,Q.todos.accessToken=e.accessToken,Q.todos.sync();var t=1e3*e.expiresIn+(new Date).getTime();e.state&&delete e.state,localStorage.setItem("authResult",JSON.stringify(e)),localStorage.setItem("expiresAt",JSON.stringify(t))}},n.accessTokenRefreshLoop=function(){var e=JSON.parse(localStorage.getItem("expiresAt")),t=e-(new Date).getTime();console.log("accessToken expires in",Object(k.a)(e,new Date)),(t-=18e5)<0?(console.warn("Time to fresh the auth token!"),n.webAuth.checkSession({},function(e,t){if(e)return console.warn("Error trying to checkSession"),console.error(e);n._postProcessAuthResult(t)})):window.setTimeout(function(){n.dismounted||n.accessTokenRefreshLoop()},3e5)},n.logIn=function(){n.webAuth.authorize({state:""})},n.logOut=function(){localStorage.removeItem("expiresAt"),localStorage.removeItem("authResult"),localStorage.removeItem("userInfo");var e="".concat(window.location.protocol,"//").concat(window.location.host,"/");n.webAuth.logout({returnTo:e,clientID:F})},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.state.loading&&(this.stopLoadingTimer=window.setTimeout(function(){e.setState({loading:!1})},2e3)),sessionStorage.setItem("notFirstTime",!0),Q.todos.obtain(),this.authenticate(),this.pullToRefresh=b.a.init({mainElement:"body",onRefresh:function(){Q.todos.accessToken&&Q.todos.sync()}})}},{key:"componentWillUnmount",value:function(){this.dismounted=!0,this.pullToRefresh&&this.pullToRefresh.destroyAll()}},{key:"authenticate",value:function(){var e=this;this.webAuth=new me.a.WebAuth({domain:W,clientID:F,redirectUri:J,audience:z,responseType:"token id_token",scope:"openid profile email"}),this.webAuth.parseHash({},function(t,n){if(t)return console.error(t);n&&window.location.hash&&(window.location.hash="");var a=!!n;if(!n){(n=JSON.parse(localStorage.getItem("authResult")))&&(a=!0);var o=JSON.parse(localStorage.getItem("expiresAt"));o&&o-(new Date).getTime()<0&&(n=null)}n&&e._postProcessAuthResult(n),a&&e.accessTokenRefreshLoop()})}},{key:"render",value:function(){var e=this;return o.a.createElement(m.a,null,o.a.createElement(fe.a,{active:this.state.loading,spinner:!0,background:"rgba(256, 256, 256, 0.92)",color:"#000",spinnerSize:"140px",text:"Loading the app..."},o.a.createElement("div",{className:"container"},o.a.createElement("div",{className:"box"},Q.user.userInfo?o.a.createElement(h.a,{to:"auth"},o.a.createElement("figure",{className:"image is-32x32 is-pulled-right avatar",title:"Logged in as ".concat(Q.user.userInfo.name,", ").concat(Q.user.userInfo.email)},o.a.createElement("img",{src:Q.user.userInfo.picture,alt:"Avatar"}))):null,o.a.createElement(f.a,null,o.a.createElement(p.a,{path:"/",exact:!0,component:$}),o.a.createElement(p.a,{path:"/timeline",exact:!0,component:ae}),o.a.createElement(p.a,{path:"/auth",exact:!0,render:function(t){return o.a.createElement(ie,Object.assign({},t,{logIn:e.logIn,logOut:e.logOut}))}}),o.a.createElement(p.a,{path:"/settings",exact:!0,component:re}),o.a.createElement(p.a,{path:"/synclog",exact:!0,component:le}),o.a.createElement(p.a,{component:pe})),o.a.createElement("nav",{className:"breadcrumb is-centered has-bullet-separator","aria-label":"breadcrumbs",style:{marginTop:30,paddingTop:10}},o.a.createElement("ul",null,o.a.createElement("li",null,o.a.createElement(h.a,{to:"/"},"Home")),o.a.createElement("li",null,o.a.createElement(h.a,{to:"/timeline"},"Time Line")),o.a.createElement("li",null,o.a.createElement(h.a,{to:"/auth"},o.a.createElement(ge,{serverError:Q.user.serverError,userInfo:Q.user.userInfo}))),o.a.createElement("li",null,o.a.createElement(h.a,{to:"/settings"},"Settings"))))))))}}]),t}(o.a.Component)),ge=function(e){function t(){return Object(r.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this.props,t=e.serverError,n=e.userInfo,a="badge is-badge-small",i="",c="";return t?(a+=" is-badge-danger",i="!",c="Authentication failed because of a server error"):n?(a+=" is-badge-success",c="Logged in as ".concat(Q.user.userInfo.name,", ").concat(Q.user.userInfo.email)):(a+=" is-badge-warning",c="You are not logged in so no remote backups can be made."),o.a.createElement("span",{className:a,"data-badge":i,title:c},"Authentication")}}]),t}(o.a.PureComponent),be=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function Ee(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var n=e.installing;n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(window.location.reload(),t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t.onSuccess&&t.onSuccess(e)))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}c.a.render(o.a.createElement(ve,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat("","/service-worker.js");be?(function(e,t){fetch(e).then(function(n){404===n.status||-1===n.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):Ee(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ")})):Ee(t,e)})}}()}},[[247,2,1]]]);
//# sourceMappingURL=main.d9339d74.chunk.js.map