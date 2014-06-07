// Copyright: All contributers to the Umple Project
// This file is made available subject to the open source license found at:
// http://umple.org/license
//
// Initializing and maintaining the features on the screen in UmpleOnline
// Layout initialization and maintenance is located in umple_layout.js.

Page = new Object();
Page.selectedItem = null;
Page.selectedClass = null;
Page.selectedAssociation = null;
Page.selectedGeneralization = null;
Page.codeEffect = null;
Page.clickCount = 0;
Page.repeatToolItem = false;
Page.shortcutsEnabled = true;
Page.modelDelimiter = "//$?[End_of_model]$?";

Page.codeMirrorOn = false;
Page.codeMirrorEditor = null;
Page.hLine = null;

// Global options
Page.readOnly = false; // initially allow editing
Page.useEditableClassDiagram = true;
Page.useGvClassDiagram = false;
Page.useGvStateDiagram = false;
Page.showAttributes = true;
Page.showMethods = false;
Page.showActions = true;
Page.modifiedDiagrams = false;

// The following is set called from umple.php
Page.init = function(doShowDiagram, doShowText, doShowMenu, doReadOnly, diagramType)
{ 
  Layout.isDiagramVisible = doShowDiagram;  
  Layout.isTextVisible = doShowText;  
  Layout.isPaletteVisible = doShowMenu;  
  Page.readOnly = doReadOnly; 

  // Set diagram type - anything else means use the default editable class diagram
  if(diagramType == "GvState")   {
    Page.useGvStateDiagram = true;
    Page.useEditableClassDiagram = false;
  }
  else if(diagramType == "GvClass")   {
    Page.useGvClassDiagram = true;
    Page.useEditableClassDiagram = false;
  }

  jQuery.noConflict();
  jQuery(document).keydown(function(event){Action.keyboardShortcut(event);});
  
  Layout.init();
  Page.initPaletteArea();
  Page.initCanvasArea();
  Page.initUmpleTextArea();
  Page.initSourceCodeArea();

  if(Page.readOnly) {jQuery("#" + Page.umpleCanvasId()).addClass("photoReady");}

  Action.loadFile();
}

Page.initPaletteArea = function()
{
  var palette = "#palette";
  var paletteItems = palette + " *";
  jQuery(palette).accordion({heightStyle: "fill", fillSpace: true, active: 1, collapsible: true});
  jQuery(paletteItems).addClass("unselectable");
  
  Layout.initPaletteSize()
  
  Page.initJQueryButton("buttonGenerateCode");
  Page.initJQueryButton("buttonStartOver");
  
  Page.initHighlighter("buttonAddClass");
  Page.initHighlighter("buttonAddAssociation");
  Page.initHighlighter("buttonAddGeneralization");
  Page.initHighlighter("buttonDeleteEntity");
  Page.initHighlighter("buttonPngImage");
  Page.initHighlighter("buttonYumlImage");
  Page.initHighlighter("buttonSimulateCode");
  Page.initHighlighter("buttonUigu");
  Page.initHighlighter("buttonCopy");
  Page.initHighlighter("buttonCopyEncodedURL");
  Page.initHighlighter("buttonSmaller");
  Page.initHighlighter("buttonLarger");
  Page.initHighlighter("buttonSyncCode");
  Page.initHighlighter("buttonSyncDiagram");
  Page.initHighlighter("buttonToggleMethods");
  Page.initHighlighter("buttonToggleAttributes");
  Page.initHighlighter("buttonToggleActions");

  Page.initToggleTool("buttonAddClass");
  Page.initToggleTool("buttonAddAssociation");
  Page.initToggleTool("buttonAddGeneralization");
  Page.initToggleTool("buttonDeleteEntity");
   
  Page.initAction("buttonPngImage");
  Page.initAction("buttonYumlImage");
  Page.initAction("buttonPhpCode");
  Page.initAction("buttonEcoreCode");  
  Page.initAction("buttonJavaCode");
  Page.initAction("buttonJavaAPIDoc");
//  Page.initAction("buttonZip");
  Page.initAction("buttonRubyCode");
  Page.initAction("buttonSqlCode");
  Page.initAction("buttonCppCode");
  Page.initAction("buttonPhotoReady");
  Page.initAction("buttonSimulateCode");
  Page.initAction("buttonShowHideTextEditor");
  Page.initAction("buttonShowHideCanvas");
  Page.initAction("buttonShowEditableClassDiagram");
  Page.initAction("buttonShowGvClassDiagram");
  Page.initAction("buttonShowGvStateDiagram");
  Page.initAction("buttonShowHideLayoutEditor");
  Page.initAction("buttonManualSync");
  Page.initAction("buttonCopy");
  Page.initAction("buttonCopyEncodedURL");
  Page.initAction("buttonUndo");
  Page.initAction("buttonRedo");
  Page.initAction("buttonUigu");
  Page.initAction("buttonStartOver");
  Page.initAction("buttonGenerateCode");
  Page.initAction("buttonSmaller");
  Page.initAction("buttonLarger");
  Page.initAction("buttonSyncCode");
  Page.initAction("buttonSyncDiagram");
  Page.initAction("buttonToggleMethods");
  Page.initAction("buttonToggleAttributes");
  Page.initAction("buttonToggleActions");

  Page.enablePaletteItem("buttonUndo", false);
  Page.enablePaletteItem("buttonRedo", false);
  Page.enablePaletteItem("buttonSyncDiagram", false);

  jQuery("#genstatus").hide();
  jQuery("#buttonViewComplete").hide();
  
  Page.initExamples();
  Page.initOptions();
  if(Page.readOnly) {
    jQuery("#mainDrawMenu").hide();
    jQuery("#layoutListItem").hide();
    jQuery("#preferencesTitle").hide();
    jQuery("#photoReadyListItem").hide();
    jQuery("#manualSyncListItem").hide();
    jQuery("#canvasSizeTitle").hide();
    jQuery("#buttonSmaller").hide();
    jQuery("#buttonLarger").hide();
    jQuery("#menuBookmarkable").hide();
  }
  if(Page.readOnly || !Layout.isPaletteVisible) {  
    jQuery("#topBookmarkable").hide();
  }
  if(!Layout.isPaletteVisible) {jQuery("#paletteColumn").hide();}
  if(!Layout.isTextVisible) {
    if(Page.readOnly) {
      jQuery("#topLine").hide(); 
    }
    else {
      jQuery("#linetext").hide();
    }
  }
}

Page.initOptions = function()
{
  jQuery("#buttonShowHideLayoutEditor").attr('checked', false);
  jQuery("#buttonShowHideTextEditor").attr('checked', Layout.isTextVisible);
  jQuery("#buttonShowHideCanvas").attr('checked', Layout.isDiagramVisible);
  jQuery("#buttonToggleAttributes").attr('checked',true);
  jQuery("#buttonToggleActions").attr('checked',true);

  if(Page.useEditableClassDiagram)
   jQuery("#buttonShowEditableClassDiagram").attr('checked', true); 
  if(Page.useGvClassDiagram)
    jQuery("#buttonShowGvClassDiagram").attr('checked', true);
  if(Page.useGvStateDiagram)
    jQuery("#buttonShowGvStateDiagram").attr('checked', true);     

  jQuery("#buttonPhotoReady").attr('checked', false);
  jQuery("#buttonManualSync").attr('checked', false);
  
  jQuery("#buttonShowHideTextEditor").attr('disabled', false);
  jQuery("#buttonShowHideCanvas").attr('disabled', false);
  jQuery("#buttonPhotoReady").attr('disabled', false);
  jQuery("#buttonManualSync").attr('disabled', false);
  
  Layout.showHideLayoutEditor(true); // hide the layout editor
}

Page.initHighlighter = function(id)
{
  var selector = "#" + id;
  jQuery(selector).mouseover(function() {Page.highlightItem(id);});
  jQuery(selector).mouseout(function() {Page.unhighlightItem(id);});
}

Page.removeHighlighter = function(id)
{
  var selector = "#" + id;
  
  jQuery(selector).unbind('mouseover');
  jQuery(selector).unbind('mouseout');
}

Page.enableCheckBoxItem = function(boxId, listItemId, doEnable)
{
  var listItem = jQuery("#" + listItemId);
  var checkbox = jQuery("#" + boxId);
  
  if (doEnable)
  {
    checkbox.attr('disabled', false);
    checkbox.css('cursor', 'pointer');
    listItem.css('color', 'Black');
    
  }
  else
  {
    checkbox.attr('disabled', true);
  checkbox.css('cursor', 'not-allowed');
  listItem.css('color', 'Silver');
  }
}

Page.enablePaletteItem = function(id, doEnable)
{
  var item = jQuery("#" + id);
  var enabled = !item.hasClass("disabled");
  
  if (enabled == doEnable) return;
  
  if (doEnable)
  {
    item.removeClass();
    item.attr('disabled', true);
    Page.initHighlighter(id);
  }
  else
  {
    item.removeClass();
    item.addClass("disabled");
    item.attr('disabled', false);
    Page.removeHighlighter(id);
  }
}

Page.initToggleTool = function(id)
{
  var item = jQuery("#" + id);
  item.click(function() {Page.toggleToolItem(id, false);});
  item.dblclick(function() {Page.toggleToolItem(id, true);});
}

Page.removeToggleTool = function(id)
{
  var item = jQuery("#" + id);
  item.unbind('click');
  item.unbind('dblclick');
}

Page.initJQueryButton = function(id)
{
  var selector = "#" + id;
  var value = jQuery(selector).attr("value");
  jQuery(selector).button({label: value});
}

Page.initAction = function(id)
{
  var selector = "#" + id;
  jQuery(selector).click(Action.clicked);
}

Page.initUmpleTextArea = function()
{
  var modelEditor = jQuery("#umpleModelEditorText");
  var layoutEditor = jQuery("#umpleLayoutEditorText");
  
  modelEditor.keyup(function(eventObject){Action.umpleTyped(eventObject);});
  modelEditor.mousedown(function(){setTimeout("jQuery(\"#linenum\").val(Action.getCaretPosition())",25)});
  layoutEditor.keyup(function(eventObject){Action.umpleTyped(eventObject);});
  modelEditor.focus(function(){Action.focusOn("umpleModelEditorText", true);});
  layoutEditor.focus(function(){Action.focusOn("umpleLayoutEditorText", true);});
  modelEditor.blur(function(){Action.focusOn("umpleModelEditorText", false);});
  layoutEditor.blur(function(){Action.focusOn("umpleLayoutEditorText", false);});
  
  Page.initCodeMirrorEditor();
  Layout.initUmpleTextAreaSize();
  if (!Layout.isTextVisible) {Layout.showHideTextEditor(false);}
}

Page.initCodeMirrorEditor = function() {
  var foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
  Page.codeMirrorEditor = CodeMirror.fromTextArea(
     document.getElementById('umpleModelEditorText'),{
        lineNumbers: true,
        matchBrackets: true,
        readOnly: Page.readOnly,
        mode: "text/x-umple",
        lineWrapping: true,
        onFocus: function(id, gained) {Action.focusOn("CodeMirror", true)},
        onBlur: function(id, gained) {Action.focusOn("CodeMirror", false)},
        onGutterClick: foldFunc,
        onChange: function(ed, changes) {Action.umpleCodeMirrorTypingActivity();},
        onCursorActivity: function() {
          Page.codeMirrorEditor.setLineClass(Page.hLine, null);
          Page.hLine = Page.codeMirrorEditor.setLineClass(Page.codeMirrorEditor.getCursor().line, "activeline");
          Action.umpleCodeMirrorCursorActivity();},
        extraKeys: { // Change consistently in umple_action.js for Mousetrap
          "Ctrl-E": function(cm) {Page.clickShowEditableClassDiagram()},
          "Ctrl-G": function(cm) {Page.clickShowGvClassDiagram()},
          "Ctrl-S": function(cm) {Page.clickShowGvStateDiagram()},
          "Ctrl-T": function(cm) {Page.clickShowHideText()},
          "Ctrl-D": function(cm) {Page.clickShowHideCanvas()},
          "Ctrl-N": function(cm) {Page.clickShowHideMenu()},
          "Ctrl-Shift-=": function(cm) {Page.clickButtonlarger()},
          "Ctrl-Shift--": function(cm) {Page.clickButtonSmaller()},
          "Ctrl-A": function(cm) {Page.clickToggleAttributes()},
          "Ctrl-M": function(cm) {Page.clickToggleMethods()}
          }
        }
      );
  Page.hLine = Page.codeMirrorEditor.setLineClass(0, "activeline");
  Page.codeMirrorOn = true;  
}

// Functions to click various menu items - invoked by code mirror and MouseTrap
Page.clickShowEditableClassDiagram = function() {
  jQuery('#buttonShowEditableClassDiagram').trigger('click');
}
Page.clickShowGvClassDiagram = function() {
  jQuery('#buttonShowGvClassDiagram').trigger('click');
}
Page.clickShowGvStateDiagram = function() {
  jQuery('#buttonShowGvStateDiagram').trigger('click');
}

Page.clickShowHideText = function() {
  jQuery('#buttonShowHideTextEditor').trigger('click');
}
Page.clickShowHideCanvas = function() {
  jQuery('#buttonShowHideCanvas').trigger('click');
}
Page.clickShowHideMenu = function() {
  Action.showHideMenu(); // No clickable button
}

Page.clickButtonlarger = function() {
  jQuery('#buttonLarger').trigger('click');
}
Page.clickButtonSmaller = function() {
  jQuery('#buttonSmaller').trigger('click');
}
Page.clickToggleAttributes = function() {
  jQuery('#buttonToggleAttributes').trigger('click');
}
Page.clickToggleMethods = function() {
  jQuery('#buttonToggleMethods').trigger('click');
}

Page.isPhotoReady = function()
{
  if(Page.readOnly) {
    return(true)
  }
  else {
    var selector = "#buttonPhotoReady";
    return jQuery(selector).attr('checked');
  }
}

Page.initSourceCodeArea = function()
{
  SyntaxHighlighter.config.clipboardSwf = 'scripts/clipboard.swf';
  var generatedCodeRowSelector = "#generatedCodeRow";
  jQuery(generatedCodeRowSelector).hide();
  jQuery("#svgCanvasContainer").hide();
}

Page.hideGeneratedCode = function()
{
  jQuery("#generatedCodeRow").hide();
  jQuery("#svgCanvasContainer").hide();
}

Page.initCanvasArea = function()
{
  var canvas = jQuery("#umpleCanvas");
  Layout.initUmpleCanvasSize();
  
  canvas.click(function(event){Action.umpleCanvasClicked(event);});
  canvas.mousemove(Action.mouseMove);
  canvas.focus(function(){Action.focusOn(Page.umpleCanvasId(), true);});
  canvas.blur(function(){Action.focusOn(Page.umpleCanvasId(), false);});
  canvas.delegate("[class$='editableDoubleClick']", 'dblclick', InlineEditor.handleOnClick);
  canvas.delegate("[class$='editableSingleClick']", 'click', InlineEditor.handleOnClick);
  canvas.resizable({stop: function(event, ui){Layout.umpleCanvasResizing(event, ui);},
                  autoHide: true,
                  minHeight: Layout.minCanvasSize.height,
                  minWidth: Layout.minCanvasSize.width,
                  handles: {'se': '#canvasGrip'}});
  
  // remove the jquery resizable handle
  //jQuery(".ui-icon-gripsmall-diagonal-se").removeClass("ui-icon-gripsmall-diagonal-se");
  //jQuery(".ui-icon").removeClass("ui-icon");
}

Page.initExamples = function()
{
  jQuery("#inputExample").change(Action.loadExample);
  jQuery("#defaultExampleOption").attr("selected",true);
 
  jQuery("#inputExampleType").change(Action.setExampleType);
  jQuery("#cdModels").attr("selected",true);
  
  jQuery("#inputExample2").change(Action.loadExample);
  jQuery("#defaultExampleOption2").attr("selected",true);
  jQuery("#itemLoadExamples2").hide();
}

Page.highlightItem = function(id)
{
  var selector = "#" + id;
  jQuery(selector).addClass("highlight");
}

Page.unhighlightItem = function(id)
{
  var selector = "#" + id;
  jQuery(selector).removeClass("highlight");
}

Page.enableDiagram = function(doEnable)
{
  Page.enableEditDragAndResize(doEnable);
  Page.enablePaletteItem("buttonAddClass", doEnable);
  Page.enablePaletteItem("buttonAddAssociation", doEnable);
  Page.enablePaletteItem("buttonAddGeneralization", doEnable);
  Page.enablePaletteItem("buttonDeleteEntity", doEnable);
  Page.showDiagramSyncNeeded(!doEnable);
}

Page.enableEditDragAndResize = function(doEnable)
{
  if (doEnable)
  {
    jQuery("span.editable").removeClass("uneditable");
    jQuery("div.umpleClass").removeClass("unselectable");
    jQuery("div.umpleClass.ui-draggable").draggable("option", "disabled", false);
    jQuery("div.umpleClass.ui-resizable").resizable("option", "disabled", false);
  } 
  else
  {
    jQuery("span.editable").addClass("uneditable");
    jQuery("div.umpleClass").addClass("unselectable");
    jQuery("div.umpleClass.ui-draggable").draggable("option", "disabled", true);
    jQuery("div.umpleClass.ui-resizable").resizable("option", "disabled", true);
  }
}

Page.toggleToolItem = function(id, doubleClicked)
{
  if (doubleClicked == undefined) doubleClicked = false;
  Page.repeatToolItem = doubleClicked;
  
  var toolSelected = id.substring(6);
  var isNewTool = (toolSelected != Page.selectedItem);
  
  if (isNewTool)
  {
    Page.selectToggleTool(toolSelected);
  }
  else
  {
    Page.unselectAllToggleTools();
  }
}

Page.unselectAllToggleTools = function()
{
  DiagramEdit.removeNewClass();
  DiagramEdit.removeNewAssociation();
  DiagramEdit.removeNewGeneralization();
  
  var allSelectedItems = "ul.toggle li.selected"; 
  jQuery(allSelectedItems).removeClass("selected highlight");
  
  setTimeout("Page.enableEditDragAndResize(true);", 500);
  Page.selectedItem = null;
  Page.repeatToolItem = false;
}

Page.selectToggleTool = function(toolSelected)
{
  if (Page.selectedItem != null)
  {
    DiagramEdit.removeNewClass();
    DiagramEdit.removeNewAssociation();
    DiagramEdit.removeNewGeneralization();f
  }
  
  Page.enableEditDragAndResize(false);
  Page.selectedItem = toolSelected;
  Action.unselectAll();
  
  var allSelectedItems = format("ul.toggle li.selected");
  var newSelectedItem = "#button" + toolSelected;
  jQuery(allSelectedItems).removeClass("selected highlight");
  jQuery(newSelectedItem).addClass("selected");
}

Page.canShowHovers = function()
{
  return Page.selectedItem == null || Page.selectedItem == "DeleteEntity";
}

Page.getRawUmpleCode = function()
{
  return document.getElementById('umpleModelEditorText').value;
}

Page.getUmpleCode = function()
{
  var modelCleaned = Page.getRawUmpleCode().replace(Page.modelDelimiter, "");
  var positioning = jQuery("#umpleLayoutEditorText").val().replace(Page.modelDelimiter, "");
  
  var umpleCode = modelCleaned + Page.modelDelimiter + positioning;
  return umpleCode;
}

Page.getEncodedURL = function()
{
  var server=window.location.href.split("?")[0];
  if(server.substr(0,42)=="http://cruise.site.uottawa.ca/umpleonline/") {
    server = "http://try.umple.org/";
  }
  return server+"?text=" + encodeURIComponent(Page.getUmpleCode());
}

Page.splitUmpleCode = function(umpleCode)
{
  var splitIndex = umpleCode.indexOf(Page.modelDelimiter);
  if (splitIndex == -1)
  {
    model = umpleCode;
    positioning = "";
  }
  else
  {
    umpleCode = umpleCode.replace(Page.modelDelimiter, "");
  
    var model = umpleCode.substr(0, splitIndex);
    var positioning = umpleCode.substr(splitIndex, umpleCode.length);
  }
  var modelAndPositioning = [model, positioning];
  return modelAndPositioning;
}  

Page.setUmpleCode = function(umpleCode, reason)
{
  var modelAndPositioning = Page.splitUmpleCode(umpleCode);
 
  Page.hideGeneratedCode();
  
  jQuery("#umpleLayoutEditorText").val(modelAndPositioning[1]);


  if(Page.codeMirrorOn) {
    Page.codeMirrorEditor.setValue(modelAndPositioning[0]);
  }
  jQuery("#umpleModelEditorText").val(modelAndPositioning[0]);
}

Page.setUmplePositioningCode = function(positioning)
{
  jQuery("#umpleLayoutEditorText").val(positioning);
}

Page.umpleCanvasId = function()
{
  return "umpleCanvas";
}

Page.showDiagramSyncNeeded = function(doShow)
{
  var canvas = jQuery("#umpleCanvas");
  var messageDiv =  '<div id="syncNeededMessage" class="syncNeededMessage unselectable">' +
              'Diagram is out of synchronization with the text due to selecting Manual Sync or an error in the text. ' +
            '</div>';
  if (doShow)
  {
    canvas.append(messageDiv);
  }
  else
  {
    jQuery("#syncNeededMessage").remove();
  }
  
}

Page.hideLoading = function()
{
  var modelEditor = "#topTextEditor";
  var layoutEditor = "#bottomTextEditor";
  var canvas = "#" + Page.umpleCanvasId();  
  
  jQuery(modelEditor).hideLoading();
  jQuery(canvas).hideLoading();
  jQuery(layoutEditor).hideLoading();
  jQuery(".bookmarkableUrl").removeClass("disabled");
}

Page.showModelLoading = function()
{
  var modelEditor = jQuery("#topTextEditor");
  if (jQuery("#textEditorColumn").is(":visible"))
  {
    modelEditor.showLoading();
  }
  jQuery(".bookmarkableUrl").addClass("disabled");
}

Page.showLayoutLoading = function()
{
  var layoutEditor = jQuery("#bottomTextEditor");
  if (layoutEditor.is(":visible")) 
  {
    layoutEditor.showLoading();
  }
  jQuery(".bookmarkableUrl").addClass("disabled");
}

Page.showCanvasLoading = function()
{
  var canvas = jQuery("#umpleCanvas");
  if (canvas.is(":visible"))
  {
    canvas.showLoading();
  }
  jQuery(".bookmarkableUrl").addClass("disabled");
}

Page.resetCanvasSize = function()
{
  Page.setUmpleCanvasSize(Layout.minCanvasSize.width, Layout.minCanvasSize.height);
}

Page.getSelectedExample = function()
{
  var inputExample = "";
  if(Page.getExampleType() == "cdModels") {
    inputExample = jQuery("#inputExample option:selected").val();
    // if diagram type is state machine, set it to class
    if(Page.useGvStateDiagram) {
     jQuery("#buttonShowEditableClassDiagram").attr('checked', true); 
      Action.changeDiagramType(1);
    }
  }
  else {
    inputExample = jQuery("#inputExample2 option:selected").val();
    // set diagramtype if not already state machine.
    if( !Page.useGvStateDiagram) {
       jQuery("#buttonShowGvStateDiagram").attr('checked', true); 
      Action.changeDiagramType(3);
    }
  }
  return inputExample;
}

Page.getExampleType = function()
{
  var exampleType = jQuery("#exampleType option:selected").val();
  return exampleType;
}

Page.showCodeDone = function()
{
  var gcselector = "#genstatus";
  jQuery(gcselector).show();
  setTimeout(function() {jQuery(gcselector).hide();}, 2000);
}

Page.showViewDone = function()
{
  var selector = "#buttonViewComplete";
  jQuery(selector).dialog({closeOnEscape:true, hide:'puff', height:100, width:250});
  setTimeout(function() {jQuery(selector).dialog("close");}, 2000);
}

Page.showGeneratedCode = function(code,language)
{
  if(language !="structureDiagram") {
  	jQuery("#generatedCodeRow").show();
  } else {
  	jQuery("#svgCanvasContainer").show();
  }

  if(language!="html" && language!="javadoc" && language !="stateDiagram" && language !="classDiagram" && language !="structureDiagram" && language !="diagramUpdate" && language != "uigu" && language != "yumlDiagram") {
    var codeparts = code.split('URL_SPLIT');
    var zipurl = "";
    var bodycode = "";
    var warningToggleLoc = 0;
    if(codeparts.length == 1) {
        bodycode = codeparts[0];
    }
    else {
        zipurl = codeparts[0];
        bodycode = codeparts[1];
    }
    jQuery("#generatedCodeRow").html(formatOnce(zipurl+'<pre class="brush: {1};">{0}</pre>',bodycode,language));
    warningToggleLoc = zipurl.indexOf("Show/Hide errors and warnings");
    if(warningToggleLoc > 30 || warningToggleLoc == -1) {
      SyntaxHighlighter.highlight("code");
    }
  }
  else { 
    //Remove the redundant <svg> tags for properly sized diagram
    if(language == "stateDiagram" || language == "classDiagram")
    {
      codeParts = code.split("<svg width=");
      code = "<svg width=" + codeParts[1].replace(/<\/svg$/, "");
      jQuery("#generatedCodeRow").html(format('{0}',code));
    } else if(language == "structureDiagram") {
    	var codeparts = code.split('URL_SPLIT');
    	var zipurl = "";
    	var bodycode = "";
    	var warningToggleLoc = 0;
    	if(codeparts.length == 1) {
	        bodycode = codeparts[0];
	    }
	    else {
        	zipurl = codeparts[0];
        	bodycode = codeparts[1];
    	}
    	var decoded = jQuery("<div/>").html(bodycode).text();
    	eval(decoded);
    	warningToggleLoc = zipurl.indexOf("Show/Hide errors and warnings");
    	if(warningToggleLoc > 30 || warningToggleLoc == -1) {
      		SyntaxHighlighter.highlight("code");
    	}
    }
  }
}

Page.setFilename = function(filename)
{
  jQuery("#filename").val(filename);
}

Page.setFeedbackMessage = function(feedbackMessage)
{
  document.getElementById('feedbackMessage').innerHTML=feedbackMessage;
}

Page.setExampleMessage = function(exampleMessage)
{
  document.getElementById('exampleMessage').innerHTML=exampleMessage;
}

Page.getFeedbackMessage = function()
{
  return document.getElementById('feedbackMessage').innerHTML;
}

Page.catFeedbackMessage = function(feedbackMessage)
{
  var origMsg = document.getElementById('feedbackMessage').innerHTML;
  document.getElementById('feedbackMessage').innerHTML=origMsg+feedbackMessage;
}

Page.getFilename = function()
{
  return jQuery("#filename").val();
}

Page.getAdvancedMode = function()
{
  return document.getElementById("advancedMode").value;
}

jQuery.fn.selectRange = function(start, end) {
  return this.each(function() 
  {
    if(this.setSelectionRange) 
    {
      this.focus();
      this.setSelectionRange(start, end);
    } 
    else if(this.createTextRange) 
    {
       var range = this.createTextRange();
       range.collapse(true);
       range.moveEnd('character', end);
       range.moveStart('character', start);
       range.select();
    }
  });
}
