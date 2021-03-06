// Photoshop Script to Create iPhone Icons from Photoshop file
//
// WARNING!!! In the rare case that there are name collisions, this script will
// overwrite (delete perminently) files in the same folder in which the selected
// icons file is located. Therefore, to be safe, before running the
// script, it's best to make sure the selected iTuensArtwork file is the only
// file in its containing folder.
//
// Copyright (c) 2010 Matt Di Pasquale
// Added tweaks Copyright (c) 2012 by Josh Jones http://www.appsbynight.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Prerequisite:
// First, create at least a 128x128 px PNG file according to:
// This script will take all the layers in your file and and name them according to the 
// the layer name and append the extention (i.e. icon.png icon@2x.png, icon@3x) 
//
// Install - Save 'Export to Multiple Sizes.jsx' to:
//   Just put the jsx-files into the Presets > Scripts folder.
// * Restart Photoshop
//
// Update:
// * Just modify & save, no need to resart Photoshop once it's installed.
//
// Run:
// * With Photoshop open, select File > Scripts > Create Icons
// * When prompted select the prepared iTunesArtwork file for your app.
// * The different version of the icons will get saved to the same folder that
//   the iTunesArtwork file is in.
//
// Adobe Photoshop JavaScript Reference
// http://www.adobe.com/devnet/photoshop/scripting.html


// Turn debugger on. 0 is off.
// $.level = 1;


try {    
    var doc = app.activeDocument;

    if (doc == null) {
        throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }

    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels

    if (doc.width != doc.height) {
        throw "Image is not square";
    }
    else if ((doc.width < 128) && (doc.height < 128)) {
        throw "Image is too small!  Image must be at least 128x128 pixels.";
    }
    else if (doc.width < 128) {
        throw "Image width is too small!  Image width must be at least 128 pixels.";
    }
    else if (doc.height < 128) {
        throw "Image height is too small!  Image height must be at least 128 pixels.";
    }
    function setAllLayersInvisible() {
        for (var i = 0; i < doc.artLayers.length; i++) {

            doc.artLayers[i].allLocked = false;

            doc.artLayers[i].visible = false;

        }
    }
    setAllLayersInvisible();
    // Folder selection dialog
    var destFolder = Folder.selectDialog("Choose an output folder");

    if (destFolder == null) {
        // User canceled, just exit
        throw "";
    }

    // Save icons in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // use PNG-24
    sfw.transparency = true;
    doc.info = null;  // delete metadata

    var icons = [
        { "ext": "", "size": 32 },
        { "ext": "@2x", "size": 64 },
        { "ext": "@3x", "size": 128 }
    ];

    var icon;
    var layerName;    
    for (var i = 0; i < doc.artLayers.length; i++) {        
        layerName = doc.artLayers[i].name;
        for (j = 0; j < icons.length; j++) {
            doc.artLayers[i].visible = true;
            icon = icons[j];
            doc.resizeImage(icon.size, icon.size, // width, height
                            null, ResampleMethod.BICUBICSHARPER);
            
            var destFileName = layerName + icon.ext + ".png";
            $.sleep(500);
            doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
            doc.activeHistoryState = startState; // undo resize
            $.sleep(500);
        }
        doc.artLayers[i].visible = false;
    }
    alert("iOS Icons created!");
}
catch (exception) {
    // Show degbug message and then quit
    if ((exception != null) && (exception != ""))
        alert(exception);
}
finally {
    //if (doc != null)
    //    doc.close(SaveOptions.DONOTSAVECHANGES);

    app.preferences.rulerUnits = initialPrefs; // restore prefs
}
