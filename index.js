'use strict';

var kevoree = require('kevoree-library');

function testAttribute(instance, dictionary, attrType) {
  if (dictionary) {
    if (dictionary.generated_KMF_ID === '0') {
      var attr = dictionary.findValuesByID(attrType.name);
      if (attr) {
        if (!attrType.optional) {
          if (!attr.value || attr.value.length === 0) {
            if (attrType.fragmentDependant) {
              throw new Error('Missing value for non-optional fragmented attribute "'+attrType.name+'" in fragment "'+dictionary.name+'" for instance "' + instance.path() + '"');
            } else {
              throw new Error('Missing value for non-optional attribute "'+attrType.name+'" for instance "' + instance.path() + '"');
            }
          }
        }
      } else {
        if (attrType.fragmentDependant) {
          throw new Error('Missing fragmented attribute "'+attrType.name+'" in fragment "'+dictionary.name+'" for instance "' + instance.path() + '"');
        } else {
          throw new Error('Missing attribute "'+attrType.name+'" for instance "' + instance.path() + '"');
        }
      }
    } else {
      throw new Error('Dictionary KMF_ID must be set to "0" to prevent diff errors in instance "' + instance.path() + '"');
    }
  } else {
    throw new Error('Missing dictionary for instance "' + instance.path() + '"');
  }
}

module.exports = function (model) {
  var visitor = new kevoree.org.kevoree.modeling.api.util.ModelVisitor();
  visitor.visit = function (instance, refInParent/*, parent*/) {
    switch (refInParent) {
      case 'nodes':
      case 'groups':
      case 'components':
      case 'hosts':
      case 'hubs':
        // instance
        if (!instance.typeDefinition) {
          throw new Error('No TypeDefinition defined for instance "' + instance.path() + '"');
        }
        if (instance.typeDefinition.dictionaryType) {
          instance.typeDefinition.dictionaryType.attributes.array.forEach(function (type) {
            if (type.fragmentDependant) {
              instance.fragmentDictionary.array.forEach(function (fDic) {
                testAttribute(instance, fDic, type);
              });
            } else {
              testAttribute(instance, instance.dictionary, type);
            }
          });
        } else {
          if (instance.dictionary) {
            throw new Error('Instance "'+ instance.path() +'" has a dictionary but it should not.');
          }
          if (instance.fragmentDictionary.size() > 0) {
            throw new Error('Instance "'+ instance.path() +'" has fragment dictionaries but it should not.');
          }
        }
        break;
    }
  };

  model.visit(visitor, true, true, true);
};
