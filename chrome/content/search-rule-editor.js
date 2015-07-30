/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("chrome://searchSidebar/content/modules/SearchRules.jsm");

var currentData, currentEngine;

var engineList;
var gEnableResults;
var urlFilterLabel, urlFilterTextbox;

var containerSetting, titleSetting, linkSetting, descriptionSetting, previewSetting;

var prevPageSetting, nextPageSetting;

function init() {
  engineList = document.getElementById("engineList");
  gEnableResults = document.getElementById("enable-results");

  urlFilterLabel = document.getElementById("url-filter-label");
  urlFilterTextbox = document.getElementById("url-filter-textbox");

  containerSetting = document.getElementById("containerSetting");
  titleSetting = document.getElementById("titleSetting");
  linkSetting = document.getElementById("linkSetting");
  descriptionSetting = document.getElementById("descriptionSetting");
  previewSetting = document.getElementById("previewSetting");

  prevPageSetting = document.getElementById("prevPageSetting");
  nextPageSetting = document.getElementById("nextPageSetting");

  // Load engine list
  var engines = Services.search.getVisibleEngines();
  engines.forEach(engine => {
    let listitem = engineList.appendItem(engine.name, engine.name);
    listitem.setAttribute("class", "listitem-iconic");
    if (engine.iconURI)
      listitem.setAttribute("image", engine.iconURI.spec);
    listitem.engine = engine;
  });

  // Select some engine by default
  engineList.selectedIndex = 0;
}

function selectEngine() {
  update();

  currentEngine = engineList.selectedItem.engine;
  currentData = SearchRules.getRulesForEngine(currentEngine);

  document.getElementById("header").setAttribute("title", currentEngine.name);

  gEnableResults.checked = currentData.enabled;

  urlFilterTextbox.value = currentData.urlFilter;

  containerSetting.value = currentData.selectors.container;
  titleSetting.value = currentData.selectors.title;
  linkSetting.value = currentData.selectors.url;
  descriptionSetting.value = currentData.selectors.description;
  previewSetting.value = currentData.selectors.previewUrl;

  prevPageSetting.value = currentData.selectors.prevPageUrl;
  nextPageSetting.value = currentData.selectors.nextPageUrl;

  updateUI();
}

function updateUI() {
  let disabled = !currentData.enabled;

  urlFilterLabel.disabled = disabled;
  urlFilterTextbox.disabled = disabled;
  containerSetting.disabled = disabled;
  titleSetting.disabled = disabled;
  linkSetting.disabled = disabled;
  descriptionSetting.disabled = disabled;
  previewSetting.disabled = disabled;
  prevPageSetting.disabled = disabled;
  nextPageSetting.disabled = disabled;
}

function update() {
  if (!currentData) {
    return;
  }

  currentData.enabled = gEnableResults.checked;

  currentData.urlFilter = urlFilterTextbox.value;

  currentData.selectors.container = containerSetting.value;
  currentData.selectors.title = titleSetting.value;
  currentData.selectors.url = linkSetting.value;
  currentData.selectors.description = descriptionSetting.value;
  currentData.selectors.previewUrl = previewSetting.value;
  currentData.selectors.prevPageUrl = prevPageSetting.value;
  currentData.selectors.nextPageUrl = nextPageSetting.value;

  SearchRules.setRulesForEngine(currentEngine, currentData);

  SearchRules.writeToFile();

  updateUI();
}

function saveAndClose() {
  update();
  SearchRules.writeToFile();
}
