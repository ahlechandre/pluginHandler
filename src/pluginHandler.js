/**
 * PluginHandler - A basic handler for register and upgrade javascript plugins.
 * 
 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
 */

// Module interface.
var pluginHandler = {

  /**
   * The plugin config data.
   * 
   * @type {{
   *  plugin: string,
   *  callback: function,
   *  upgradeable: boolean|null 
   * }} 
   */
  PluginConfig: {},

  /**
   * The plugin internal config data.
   * 
   * @type {{
   *  plugin: string,
   *  callback: function,
   *  upgradeable: boolean|null, 
   *  isUpgraded: boolean, 
   * }} 
   */
  PluginConfigInternal: {},

  /** 
   * Registers an specific plugin.
   * 
   * @param {pluginHandler.PluginConfig} 
   */
  register: function (config) { },

  /**
   * Upgrade an specific registered plugin. 
   * 
   * @param {pluginHandler.PluginConfig.plugin}
   */
  upgrade: function (plugin) { },

  /**
   * Upgrade all registered plugins that is upgradeable or 
   * all registered plugins that is not upgradeable and is not upgraded yet.
   * 
   */
  upgradeAll: function () { },

  /**
   * Upgrade all registereds plugins.
   * 
   */
  upgradeAllForce: function () { },

  /**
   * Removes an specific registered and/or upgraded plugin. 
   * 
   * @param {pluginHandler.PluginConfig.plugin}
   */
  destroy: function (plugin) { },

  /**
   * Removes all registered and upgraded plugins. 
   * 
   */
  destroyAll: function () { },

  /**
   * Gets all registereds plugins.
   * 
   * @return {array<pluginHandler.PluginConfigInternal>}
   */
  getAllRegistered: function () { },

  /**
   * Gets all registereds and upgraded plugins.
   * 
   * @return {array<pluginHandler.PluginConfig>}
   */
  getAllUpgraded: function () { },

  /**
   * Checks if a given plugin is registered.
   * 
   * @return {boolean}
   */
  isRegistered: function (pluginName) { },

  /**
   * Checks if a given plugin is upgraded.
   * 
   * @return {boolean}
   */
  isUpgraded: function (pluginName) { },
};

pluginHandler = (function () {
  'use strict';

  /**
   * All registereds plugins config.
   * 
   * @type {pluginHandler.PluginConfigInternal}
   */
  var _registeredPlugins = [];

  /**
   * All registereds and upgraded plugins config.
   * 
   * @type {pluginHandler.PluginConfigInternal}
   */
  var _upgradedPlugins = [];

  /** 
   * Registers an specific plugin.
   * 
   * @param {pluginHandler.PluginConfig} 
   */
  var _register = function (config) {
    /** @type {pluginHandler.PluginConfigInternal} */
    var newConfig = {};

    if ((typeof (config) === 'undefined') || (typeof (config) !== 'object')) {
      console.error('Please, register a valid plugin.');
      return;
    } else if (typeof (config['plugin']) !== 'string') {
      console.error('Please, register a valid plugin name.');
      return;
    } else if (typeof (config['callback']) !== 'function') {
      console.error('Please, register a valid function as plugin callback.');
      return;
    }

    newConfig['plugin'] = config['plugin'];
    newConfig['callback'] = config['callback'];
    newConfig['upgradeable'] = ((typeof (config['upgradeable']) === 'undefined') || (config['upgradeable'] == true) ? true : false);
    newConfig['isUpgraded'] = false;

    // Check if the plugin is already registered.
    for (var i = 0; i < _registeredPlugins.length; i++) {

      if (_registeredPlugins[i].plugin === newConfig['plugin'])
        throw new Error('The ' + newConfig['plugin'] + ' plugin is already registered.');
    };

    _registeredPlugins.push(newConfig);
  };

  /**
   * Upgrade internally the given plugin.
   * 
   * @param {pluginHandler.PluginConfig}
   */
  var _upgradeInternal = function (config) {
    /** @type {pluginHandler.PluginConfig} */
    var configUpgraded = {};
    // Initializes the plugin.
    config.callback();
    config.isUpgraded = true;

    for (var i = 0; i < _upgradedPlugins.length; i++) {

      if (_upgradedPlugins[i].plugin === config['plugin'])
        return;
    }

    configUpgraded['plugin'] = config['plugin'];
    configUpgraded['callback'] = config['callback'];
    configUpgraded['upgradeable'] = config['upgradeable'];
    _upgradedPlugins.push(configUpgraded);
  };

  /**
   * Upgrade an specific registered plugin. 
   * 
   * @param {pluginHandler.PluginConfig.plugin}
   */
  var _upgrade = function (plugin) {

    for (var i = 0; i < _registeredPlugins.length; i++) {

      // Found the plugin to upgrade.
      if (_registeredPlugins[i].plugin === plugin) {
        _upgradeInternal(_registeredPlugins[i]);
        break;
      }
    }
  };

  /**
   * Upgrade all registered plugins that is upgradeable or 
   * all registered plugins that is not upgradeable and is not upgraded yet.
   * 
   */
  var _upgradeAll = function () {

    for (var i = 0; i < _registeredPlugins.length; i++) {

      if (_registeredPlugins[i].upgradeable || (!_registeredPlugins[i].upgradeable && !_registeredPlugins[i].isUpgraded)) {
        _upgradeInternal(_registeredPlugins[i]);
      }
    }
  };

  /**
   * Upgrade all registereds plugins.
   * 
   */
  var _upgradeAllForce = function () {

    for (var i = 0; i < _registeredPlugins.length; i++) {
      _upgradeInternal(_registeredPlugins[i]);
    }
  };

  /**
   * Removes internally an specific registered and/or upgraded plugin. 
   * 
   * @param {number}
   */
  var _destroyInternal = function (registeredIndex) {
    var pluginName = _registeredPlugins[registeredIndex].plugin;
    
    if (_registeredPlugins[registeredIndex].isUpgraded) {
      
      for (var i = 0; i < _upgradedPlugins.length; i++) {
        
        if (_upgradedPlugins[i].plugin === pluginName) {
          // Removes from upgraded array.
          _upgradedPlugins.splice(i, 1);
          break;
        }
      }
    }
    // Removes from registereds array.
    _registeredPlugins.splice(registeredIndex, 1);    
  };

  /**
   * Removes an specific registered and/or upgraded plugin. 
   * 
   * @param {pluginHandler.PluginConfig.plugin}
   */
  var _destroy = function (pluginName) {
    
    for (var i = 0; i < _registeredPlugins.length; i++) {
      
      if (_registeredPlugins[i].plugin === pluginName) {
        _destroyInternal(i);
        break;
      }
    }
  };

  /**
   * Removes all registered and upgraded plugins. 
   * 
   */
  var _destroyAll = function () {
    var registeredLength = _registeredPlugins.length;
        
    for (var i = 0; i < registeredLength; i++) {      
      _destroyInternal(0);
    }
  };


  /**
   * Gets all registereds plugins.
   * 
   * @return {array<pluginHandler.PluginConfigInternal>}
   */
  var _getAllRegistered = function () {
    return _registeredPlugins;
  };

  /**
   * Gets all registereds and upgraded plugins.
   * 
   * @return {array<pluginHandler.PluginConfig>}
   */
  var _getAllUpgraded = function () {
    return _upgradedPlugins;
  };

  /**
   * Checks if a given plugin is registered.
   * 
   * @return {boolean}
   */
  var _isRegistered = function (pluginName) {
    var isRegistered = false;

    for (var i = 0; i < _registeredPlugins.length; i++) {

      if (_registeredPlugins[i].plugin === pluginName) {
        isRegistered = true;
        break;
      }
    }
    return isRegistered;
  };

  /**
   * Checks if a given plugin is upgraded.
   * 
   * @return {boolean}
   */
  var _isUpgraded = function (pluginName) {
    var isUpgraded = false;

    for (var i = 0; i < _upgradedPlugins.length; i++) {

      if (_upgradedPlugins[i].plugin === pluginName) {
        isUpgraded = true;
        break;
      }
    }
    return isUpgraded;
  };

  return {
    register: _register,
    upgrade: _upgrade,
    upgradeAll: _upgradeAll,
    upgradeAllForce: _upgradeAllForce,
    getAllRegistered: _getAllRegistered,
    getAllUpgraded: _getAllUpgraded,
    isRegistered: _isRegistered,
    isUpgraded: _isUpgraded,
    destroy: _destroy,
    destroyAll: _destroyAll,
  };
})();

window['pluginHandler'] = pluginHandler;

// Initializes the all plugins on page load.
window.addEventListener('load', function () {
  pluginHandler.upgradeAll();
});

