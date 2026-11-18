//=============================================================================
// Plugin for RPG Maker MZ
// UISizeForEachScene.js
//=============================================================================
// [Update History]
// Ver1.0.0 2023/Oct/14 First Release
// Ver1.1.0 2023/Oct/19 Fix Bug: Full screen was reset when changing screen
// Ver1.1.1 2023/Oct/20 When it's full screen, not change window size if
//                      it changes UI size alone.
// Ver1.1.2 2023/Oct/21 When return to Title Scene, it adjusts window size.
// Ver1.2.0 2024/Sep/28 Add plugin command to change screen size dynamically

/*:
 * @target MZ
 * @plugindesc [Ver1.2.0]Set screen size for each scene
 * @author Sasuke KANNAZUKI
 *
 * @param mapSize
 * @text Map Screen Size
 * @desc Screen size of Scene_Map
 * @type struct<ScreenSize>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param battleSize
 * @text Battle Screen Size
 * @desc Screen size of Scene_Battle
 * @type struct<ScreenSize>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param menuSize
 * @text Menu Screen Size
 * @desc Common Screen Size of the sub class of Scene_MenuBase
 * @type struct<ScreenSize>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param doesSetShop
 * @text Set Shop Screen Size?
 * @desc true:Set original screen size, false:The same as menu size
 * @type boolean
 * @on Set Original Size
 * @off The Same as Menu
 * @default true
 *
 * @param shopSize
 * @parent doesSetShop
 * @text Shop Screen Size
 * @desc Screen size of Scene_Shop when it sets original size
 * @type struct<ScreenSize>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param doesSetName
 * @text Set Name Input Screen Size?
 * @desc true:Set original screen size, false:The same as menu size
 * @type boolean
 * @on Set Original Size
 * @off The Same as Menu
 * @default true
 *
 * @param nameInputSize
 * @parent doesSetName
 * @text Name Input Screen Size
 * @desc Screen size of Scene_Name when it sets original size
 * @type struct<ScreenSize>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param userDefined
 * @text User Defined Scene
 * @desc Screen size of the scene that is defined in other plugin
 * @type struct<OriginalSize>[]
 * @default []
 *
 * @command change
 * @text Change Screen Size
 * @desc Change Screen Size Immediately
 *
 * @arg newSize
 * @text New Screen Size
 * @desc New screen size of map
 * @type struct<ScreenSize>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @arg doesPreserve
 * @text Save This Setting?
 * @desc Whether to apply this setting when returning from another scene
 * @type boolean
 * @on Save
 * @off Discard
 * @default true
 *
 * @command reset
 * @text Reset Setting
 * @desc Reset screen size settings that set by plugin commands.
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 * This plugin enables to change screen size dynamically when it changes scene.
 *
 * [Summary]
 * It can set the screen size of map, battle, and menu.
 * It can also set that of shop scene and name input scene.
 * Screen size also includes UI size.
 *
 * It can also set the screen size for scenes defined in another plugin.
 *
 * [Note]
 * When it's full screen mode (F4) and changes scene, 
 * screen will blink by changing window mode for a moment
 * unless it doesn't change screen width and/or height.
 * (i.e. When it changes only UI area size, screen will not blink.)
 *
 * [Plugin Commands]
 * It enables to change map screen size dynamically.
 * Known Bug:
 * - When do this on full screen, sometimes become window mode.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc [Ver1.2.0]シーン毎に画面サイズを変更
 * @author 神無月サスケ
 *
 * @param mapSize
 * @text マップ画面サイズ
 * @desc Scene_Map の画面サイズです。
 * @type struct<ScreenSizeJpn>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param battleSize
 * @text 戦闘画面サイズ
 * @desc Scene_Battle の画面サイズです。
 * @type struct<ScreenSizeJpn>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param menuSize
 * @text メニュー画面サイズ
 * @desc Scene_MenuBase を継承したメニュー一括の画面サイズです。
 * @type struct<ScreenSizeJpn>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param doesSetShop
 * @text ショップ画面独自設定？
 * @desc 特定のサイズにするか、メニューと同じサイズにするか
 * @type boolean
 * @on 特定のサイズ
 * @off メニューと同じ
 * @default true
 *
 * @param shopSize
 * @parent doesSetShop
 * @text ショップ画面サイズ
 * @desc Scene_Shopを特定のサイズにする場合の画面サイズです。
 * @type struct<ScreenSizeJpn>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param doesSetName
 * @text 名前入力画面独自設定？
 * @desc 特定のサイズにするか、メニューと同じサイズにするか
 * @type boolean
 * @on 特定のサイズ
 * @off メニューと同じ
 * @default true
 *
 * @param nameInputSize
 * @parent doesSetName
 * @text 名前入力画面サイズ
 * @desc Scene_Nameを特定のサイズにする場合の画面サイズです。
 * @type struct<ScreenSizeJpn>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @param userDefined
 * @text ユーザー定義シーン
 * @desc プラグインなどで定義されたシーンの画面サイズです。
 * @type struct<OriginalSizeJpn>[]
 * @default []
 *
 * @command change
 * @text 画面サイズ変更
 * @desc 画面サイズの変更をただちに行います。
 *
 * @arg newSize
 * @text 変更後の画面サイズ
 * @desc マップ画面のサイズを変更します
 * @type struct<ScreenSizeJpn>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 * @arg doesPreserve
 * @text この設定を保持？
 * @desc 別のシーンから戻ってきても、この変更を保持するか、それとも破棄するか
 * @type boolean
 * @on 保持
 * @off 破棄
 * @default true
 *
 * @command reset
 * @text 画面サイズ設定初期化
 * @desc プラグインコマンドで変更した座標をリセットします
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、マップ、バトル、メニューなど、
 * シーン毎に画面サイズを変更可能にします。
 *
 * ■概要
 * デフォルトでは、マップ、バトル、メニューなど、シーン切り替わり時に
 * 指定された画面サイズ、UIサイズに変更します。
 *
 * ショップシーンや名前入力シーンでも、メニューと同じにするか、
 * 異なる画面サイズにするか、パラメータで選択、設定可能です。
 *
 * また、他のプラグインで追加されたシーンや、
 * メニューのうち特定のシーンのみ別のサイズにすることも
 * パラメータで設定可能です。
 *
 * ■注意
 * F4で全画面表示の際、ウィンドウサイズの異なるシーンに移行した時、
 * 一瞬全画面が解除されます。
 * ただしウィンドウサイズを変更せず、UIサイズのみを変更した場合は
 * この現象は起こりません。
 *
 * ■プラグインコマンド
 * マップ画面で、画面サイズの変更を行えます。
 * 一時的な変更か、ずっとこのサイズにするかを選択出来ます。
 * 既知のバグ：
 * - 全画面でこれを行った時、たまに全画面が解除されます
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

/*~struct~ScreenSize:
 *
 * @param width
 * @text Window Width
 * @desc Set Graphic.width
 * @type number
 * @default 816
 *
 * @param height
 * @text Window Height
 * @desc Set Graphic.height
 * @type number
 * @default 624
 *
 * @param boxWidth
 * @text UI Area Width
 * @desc Set Graphic.boxWidth
 * @type number
 * @default 816
 *
 * @param boxHeight
 * @text UI Area Height
 * @desc Set Graphic.boxHeight
 * @type number
 * @default 624
 *
 */

/*~struct~ScreenSizeJpn:
 *
 * @param width
 * @text 画面幅
 * @desc Graphic.width を設定します。
 * @type number
 * @default 816
 *
 * @param height
 * @text 画面高さ
 * @desc Graphic.height を設定します。
 * @type number
 * @default 624
 *
 * @param boxWidth
 * @text UIエリア幅
 * @desc Graphic.boxWidth を設定します。
 * @type number
 * @default 816
 *
 * @param boxHeight
 * @text UIエリア高さ
 * @desc Graphic.boxHeight を設定します。
 * @type number
 * @default 624
 *
 */

/*~struct~OriginalSize:
 *
 * @param sceneName
 * @text Scene Name
 * @desc Scene name that is declare in the plugin
 * @type string
 * @default Scene_XXXX
 *
 * @param screenSize
 * @text Screen Size
 * @desc Screen size of the scene
 * @type struct<ScreenSizeJpn>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 */

/*~struct~OriginalSizeJpn:
 *
 * @param sceneName
 * @text シーン名
 * @desc プラグイン内で宣言されたシーン名です。
 * @type string
 * @default Scene_XXXX
 *
 * @param screenSize
 * @text 画面サイズ
 * @desc 指定したシーンの画面サイズです。
 * @type struct<ScreenSizeJpn>
 * @default {"width":"816","height":"624","boxWidth":"816","boxHeight":"624"}
 *
 */

(() => {
  const pluginName = 'UISizeForEachScene';
  //
  // process parameters
  //
  const toObject = screenSizeText => {
    const object = JsonEx.parse(screenSizeText);
    Object.keys(object).forEach(key => object[key] = +object[key]);
    return object;
  };

  const arrayToObject = screenArrayText => {
    let object = {};
    const screenArray = eval(screenArrayText);
    for (const sceneText of screenArray) {
      const sceneObj = JsonEx.parse(sceneText);
      object[sceneObj.sceneName] = toObject(sceneObj.screenSize);
    }
    return object;
  };

  const parameters = PluginManager.parameters(pluginName);
  const mapSize = toObject(parameters['mapSize']);
  const battleSize = toObject(parameters['battleSize']);
  const menuSize = toObject(parameters['menuSize']);
  const doesSetShop = eval(parameters['doesSetShop']);
  const shopSize = toObject(parameters['shopSize']);
  const doesSetName = eval(parameters['doesSetName']);
  const nameInputSize = toObject(parameters['nameInputSize']);
  const userDefined = arrayToObject(parameters['userDefined']);

  //
  // process plugin commands
  //
  PluginManager.registerCommand(pluginName, 'change', args => {
    if (!$gameParty.inBattle()) {
      const newSize = toObject(args.newSize);
      if (eval(args.doesPreserve)) {
        $gameSystem.mapScreenSize = newSize;
      }
      SceneManager._scene.resizeScreen(newSize);
    }
  });
  
  PluginManager.registerCommand(pluginName, 'reset', args => {
    if (!$gameParty.inBattle()) {
      SceneManager._scene.resizeScreen(mapSize);
    }
    $gameSystem.mapScreenSize = null;
  });
  
  //
  // Check if it needs to change size
  //
  const applyBoxMargin = size => {
    const boxMargin = 4;
    return size - boxMargin * 2;
  };

  const needsResizeScreen = screenSize => {
    const s = screenSize;
    const w = s.width;
    const h = s.height;
    const bw = applyBoxMargin(s.boxWidth);
    const bh = applyBoxMargin(s.boxHeight);
    return w !== Graphics.width || h !== Graphics.height ||
      bw !== Graphics.boxWidth || bh !== Graphics.boxHeight;
  };

  const doesResizeBoxAlone = screenSize => {
    const w = screenSize.width;
    const h = screenSize.height;
    return w === Graphics.width && h === Graphics.height;
  };

  //
  // Resize Screen
  //

  const memorizeFullScreen = () => {
    $gameTemp.needsFullScreen = !!Graphics._isFullScreen();
  };

  Scene_Base.prototype.resizeScreen = function(screenSize) {
    if (needsResizeScreen(screenSize)) {
      const resizeBoxAlone = doesResizeBoxAlone(screenSize);
      if (!resizeBoxAlone) {
        memorizeFullScreen();
        Graphics.resize(screenSize.width, screenSize.height);
      }
      this.adjustBoxSize(screenSize);
      if (!resizeBoxAlone) {
        this.adjustWindow();
      }
    }
  };

  Scene_Base.prototype.adjustBoxSize = function(screenSize) {
    // record current data
    const uiAreaWidth = $dataSystem.advanced.uiAreaWidth;
    const uiAreaHeight = $dataSystem.advanced.uiAreaHeight;
    // change data to respect Scene_Boot.prototype.adjustBoxSize
    $dataSystem.advanced.uiAreaWidth = screenSize.boxWidth;
    $dataSystem.advanced.uiAreaHeight = screenSize.boxHeight;
    // call Scene_Boot's function
    Scene_Boot.prototype.adjustBoxSize.call(this);
    // restore data
    $dataSystem.advanced.uiAreaWidth = uiAreaWidth;
    $dataSystem.advanced.uiAreaHeight = uiAreaHeight;
  };

  Scene_Base.prototype.screenScale = function() {
    return Scene_Boot.prototype.screenScale.call(this);
  };

  Scene_Base.prototype.adjustWindow = function() {
    Scene_Boot.prototype.adjustWindow.call(this);
  };

  //
  // Call resize function from various classes
  //
  const restoreFullScreen = () => {
    if ($gameTemp && $gameTemp.needsFullScreen) {
      Graphics._requestFullScreen();
      $gameTemp.needsFullScreen = false;
    }
  };

  const _Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function() {
    restoreFullScreen();
    _Scene_Base_update.call(this);
  };

  const defaultSize = () => {
    const d = $dataSystem.advanced;
    const w = d.screenWidth;
    const h = d.screenHeight;
    const bw = d.uiAreaWidth;
    const bh = d.uiAreaHeight;
    return {width:w, height:h, boxWidth:bw, boxHeight:bh};
  };

  const _Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function() {
    this.resizeScreen(defaultSize());
    _Scene_Title_create.call(this);
  };

  const _Scene_Map_create = Scene_Map.prototype.create;
  Scene_Map.prototype.create = function() {
    this.resizeScreen($gameSystem.mapScreenSize || mapSize);
    _Scene_Map_create.call(this);
  };

  const _Scene_Battle_create = Scene_Battle.prototype.create;
  Scene_Battle.prototype.create = function() {
    this.resizeScreen(battleSize);
    _Scene_Battle_create.call(this);
  };

  const userDefinedScene = () => {
    return userDefined[SceneManager._scene.constructor.name];
  };

  const _Scene_Base_create = Scene_Base.prototype.create;
  Scene_Base.prototype.create = function() {
   const originalSize = userDefinedScene();
   if (originalSize) {
     this.resizeScreen(originalSize);
   }
    _Scene_Base_create.call(this);
  };

  const _Scene_MenuBase_create = Scene_MenuBase.prototype.create;
  Scene_MenuBase.prototype.create = function() {
    // If the menu sets different setting from common menu setting
    if (!$gameTemp.originalScreenSize && !userDefinedScene()) {
      this.resizeScreen(menuSize);
    }
    _Scene_MenuBase_create.call(this);
  };

  const _Scene_Shop_create = Scene_Shop.prototype.create;
  Scene_Shop.prototype.create = function() {
    if (doesSetShop) {
      $gameTemp.originalScreenSize = true;
      this.resizeScreen(shopSize);
      _Scene_Shop_create.call(this);
      $gameTemp.originalScreenSize = false;
      return;
    }
    _Scene_Shop_create.call(this);
  };

  const _Scene_Name_create = Scene_Name.prototype.create;
  Scene_Name.prototype.create = function() {
    if (doesSetName) {
      $gameTemp.originalScreenSize = true;
      this.resizeScreen(nameInputSize);
      _Scene_Name_create.call(this);
      $gameTemp.originalScreenSize = false;
      return;
    }
    _Scene_Name_create.call(this);
  };

})();
