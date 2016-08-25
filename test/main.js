'use strict';

const kevoree = require('kevoree-library');
const expect = require('expect');

const modelValidator = require('..');

describe('modelValidator(...)', function () {

  const factory = new kevoree.factory.DefaultKevoreeFactory();
  const loader = factory.createJSONLoader();

  context('must not throw when', function () {
    it('minimal model (no instance, no package, etc.)', function () {
      const model = JSON.stringify(require('../fixtures/valid/minimum.json'));
      expect(function () {
        modelValidator(loader.loadModelFromString(model).get(0));
      }).toNotThrow();
    });

    it('an empty value is set for an optional attribute', function () {
      const model = JSON.stringify(require('../fixtures/valid/empty-optional-attr.json'));
      expect(function () {
        modelValidator(loader.loadModelFromString(model).get(0));
      }).toNotThrow();
    });

    it('a typeDefinition does not have a dictionary type', function () {
      const model = JSON.stringify(require('../fixtures/valid/missing-dic-type.json'));
      expect(function () {
        modelValidator(loader.loadModelFromString(model).get(0));
      }).toNotThrow();
    });
  });

  context('must throw when', function () {
    it('an instance misses its typeDefinition', function () {
      const model = JSON.stringify(require('../fixtures/invalid/no-tdef.json'));
      expect(function () {
        modelValidator(loader.loadModelFromString(model).get(0));
      }).toThrow(/No TypeDefinition defined/);
    });

    it('an instance misses its dictionary', function () {
      const model = JSON.stringify(require('../fixtures/invalid/missing-dic.json'));
      expect(function () {
        modelValidator(loader.loadModelFromString(model).get(0));
      }).toThrow(/Missing dictionary/);
    });

    it('an attribute is missing in dictionary', function () {
      const model = JSON.stringify(require('../fixtures/invalid/missing-attr.json'));
      expect(function () {
        modelValidator(loader.loadModelFromString(model).get(0));
      }).toThrow(/Missing attribute/);
    });

    it('a non-optional attribute has an empty value set', function () {
      const model = JSON.stringify(require('../fixtures/invalid/missing-attr2.json'));
      expect(function () {
        modelValidator(loader.loadModelFromString(model).get(0));
      }).toThrow(/Missing value/);
    });
  });
});
