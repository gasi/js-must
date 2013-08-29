var assert = require("assert")
var Must = require("..")

function mustThrowAssertionError(test, props) {
  describe("AssertionError", function() {
    it("must be thrown", function() {
      assert.throws(test, Must.AssertionError)
    })

    it("must have properties", function() {
      try { test() }
      catch (ex) {
        assert.deepEqual(ex, props)
      }
    })

    it("must have stack trace", function() {
      try { test() }
      catch (ex) {
        var stack = ex.stack.split("\n")
        assert(stack[0].match(/AssertionError/, "must include AssertionError"))
        assert(stack[1].match(/\/test\//), "must have test at top")
      }
    })
  })
}

describe("Must.prototype.not", function() {
  it("must return an instance of Must", function() {
    assert(true.must.not instanceof Must)
  })

  it("must carry over the current state", function() {
    assert.doesNotThrow(function() { false.must.not.equal(true) })
  })

  it("must inverse condition each time", function() {
    assert.doesNotThrow(function() { true.must.not.not.equal(true) })
  })

  it("must return a new instance of Must", function() {
    var must = true.must
    assert.notStrictEqual(must.not, must)
  })
})

describe("Must.prototype.be", function() {
  it("must return an instance of Must", function() {
    assert(true.must.be instanceof Must)
  })

  it("must carry over the current state", function() {
    assert.doesNotThrow(function() { true.must.be.true() })
  })

  it("must be like Must.prototype.equal", function() {
    assert.doesNotThrow(function() { false.must.be(false) })
    assert.throws(function() { true.must.be(false) })

    assert.doesNotThrow(function() { (42).must.be(42) })
    assert.throws(function() { (42).must.be(1337) })

    assert.doesNotThrow(function() { var obj = {}; obj.must.be(obj) })
    assert.throws(function() { ({}).must.be({}) })
  })

  mustThrowAssertionError(function() { true.must.be(42) }, {
    actual: true,
    expected: 42,
    message: "true must equal 42"
  })

  describe(".not", function() {
    it("must inverse the assertion", function() {
      assert.throws(function() { true.must.not.be(true) })
    })

    it("must carry over the current state", function() {
      assert.throws(function() { true.must.not.be.true() })
    })

    mustThrowAssertionError(function() { true.must.not.be(true) }, {
      actual: true,
      expected: true,
      message: "true must not equal true"
    })
  })
})

describe("Must.prototype.to", function() {
  it("must return an instance of Must", function() {
    assert(true.must.to instanceof Must)
  })

  it("must carry over the current state", function() {
    assert.doesNotThrow(function() { true.must.to.true() })
  })
})

describe("Must.prototype.a", function() {
  it("must return an instance of Must", function() {
    assert(true.must.a instanceof Must)
  })

  it("must carry over the current state", function() {
    assert.doesNotThrow(function() { true.must.be.a.true() })
  })
})

describe("Must.prototype.an", function() {
  it("must return an instance of Must", function() {
    assert(true.must.an instanceof Must)
  })

  it("must carry over the current state", function() {
    assert.doesNotThrow(function() { [].must.be.an.instanceof(Array) })
  })
})

function mustPassTrue(name, truthy) {
  var pass = truthy ? "pass" : "fail"
  var fail = truthy ? "fail" : "pass"
  var throws = truthy ? assert.throws : assert.doesNotThrow
  var doesNotThrow = truthy ? assert.doesNotThrow : assert.throws
  
  it("must "+pass+" given true literal", function() {
    doesNotThrow(function() { Must(true).be[name]() })
  })

  it("must "+pass+" when called on true literal", function() {
    doesNotThrow(function() { true.must.be[name]() })
  })

  it("must fail given true object", function() {
    assert.throws(function() { Must(new Boolean(true)).be[name]() })
  })

  it("must "+fail+" given false literal", function() {
    throws(function() { Must(false).be[name]() })
  })

  it("must "+fail+" when called on false literal", function() {
    throws(function() { false.must.be[name]() })
  })

  it("must fail given false object", function() {
    assert.throws(function() { Must(new Boolean(false)).be[name]() })
  })

  it("must fail given zero number literal", function() {
    assert.throws(function() { Must(0).be[name]() })
  })

  it("must fail when called on zero number literal", function() {
    assert.throws(function() { (0).must.be[name]() })
  })

  it("must not do anything when not called as a function", function() {
    assert.doesNotThrow(function() { Must(!truthy).be[name] })
  })

  mustThrowAssertionError(function() { (!truthy).must.be[name]() }, {
    actual: !truthy,
    expected: truthy,
    message: !truthy + " must be " + truthy
  })

  describe(".not", function() {
    it("must inverse the assertion", function() {
      assert.throws(function() { truthy.must.not.be[name]() })
    })

    mustThrowAssertionError(function() { truthy.must.not.be[name]() }, {
      actual: truthy,
      expected: truthy,
      message: truthy + " must not be " + truthy
    })
  })
}

describe("Must.prototype.true", function() {
  mustPassTrue("true", true)
})

describe("Must.prototype.false", function() {
  mustPassTrue("false", false)
})

describe("Must.prototype.null", function() {
  it("must pass given null", function() {
    assert.doesNotThrow(function() { Must(null).be.null() })
  })

  it("must not pass given true literal", function() {
    assert.throws(function() { Must(true).be.null() })
  })

  it("must not pass given false literal", function() {
    assert.throws(function() { Must(false).be.null() })
  })

  it("must not pass given undefined", function() {
    assert.throws(function() { Must(undefined).be.null() })
  })

  it("must not pass given empty string", function() {
    assert.throws(function() { Must("").be.null() })
  })

  it("must not do anything when not called as a function", function() {
    assert.doesNotThrow(function() { Must(null).be.null })
  })

  mustThrowAssertionError(function() { true.must.be.null() }, {
    actual: true,
    expected: null,
    message: "true must be null"
  })

  describe(".not", function() {
    it("must inverse the assertion", function() {
      assert.throws(function() { Must(null).not.be.null() })
    })

    mustThrowAssertionError(function() { Must(null).not.be.null() }, {
      actual: null,
      expected: null,
      message: "null must not be null"
    })
  })
})

describe("Must.prototype.undefined", function() {
  it("must pass given undefined", function() {
    assert.doesNotThrow(function() { Must(undefined).be.undefined() })
  })

  it("must not pass given true literal", function() {
    assert.throws(function() { Must(true).be.undefined() })
  })

  it("must not pass given false literal", function() {
    assert.throws(function() { Must(false).be.undefined() })
  })

  it("must not pass given null", function() {
    assert.throws(function() { Must(null).be.undefined() })
  })

  it("must not pass given empty string", function() {
    assert.throws(function() { Must("").be.undefined() })
  })

  it("must not do anything when not called as a function", function() {
    assert.doesNotThrow(function() { Must(undefined).be.undefined })
  })

  mustThrowAssertionError(function() { true.must.be.undefined() }, {
    actual: true,
    expected: undefined,
    message: "true must be undefined"
  })

  describe(".not", function() {
    it("must inverse the assertion", function() {
      assert.throws(function() { Must(undefined).not.be.undefined() })
    })

    mustThrowAssertionError(function() { Must(undefined).not.be.undefined() }, {
      actual: undefined,
      expected: undefined,
      message: "undefined must not be undefined"
    })
  })
})

function mustPassTruthy(name, truthy) {
  var pass = truthy ? "pass" : "fail"
  var fail = truthy ? "fail" : "pass"
  var throws = truthy ? assert.throws : assert.doesNotThrow
  var doesNotThrow = truthy ? assert.doesNotThrow : assert.throws

  it("must "+fail+" given null", function() {
    throws(function() { Must(null).be[name]() })
  })

  it("must "+fail+" given undefined", function() {
    throws(function() { Must(undefined).be[name]() })
  })

  describe("given booleans", function() {
    it("must "+pass+" given true literal", function() {
      doesNotThrow(function() { Must(true).be[name]() })
    })

    it("must "+pass+" when called on true literal", function() {
      doesNotThrow(function() { true.must.be[name]() })
    })

    it("must "+pass+" given true object", function() {
      doesNotThrow(function() { Must(new Boolean(true)).be[name]() })
    })

    it("must "+fail+" given false literal", function() {
      throws(function() { Must(false).be[name]() })
    })

    it("must "+fail+" when called on false literal", function() {
      throws(function() { false.must.be[name]() })
    })

    it("must "+pass+" given false object", function() {
      doesNotThrow(function() { Must(new Boolean(false)).be[name]() })
    })
  })

  describe("given strings", function() {
    it("must "+pass+" given literal", function() {
      doesNotThrow(function() { Must("truthy").be[name]() })
    })

    it("must "+pass+" when called on literal", function() {
      doesNotThrow(function() { "truthy".must.be[name]() })
    })

    it("must "+pass+" given object", function() {
      doesNotThrow(function() { Must(new String("truthy")).be[name]() })
    })

    it("must "+pass+" given zero literal", function() {
      doesNotThrow(function() { Must("0").be[name]() })
    })

    it("must "+pass+" when called on zero literal", function() {
      doesNotThrow(function() { "0".must.be[name]() })
    })

    it("must "+pass+" given zero object", function() {
      doesNotThrow(function() { Must(new String("0")).be[name]() })
    })

    it("must "+fail+" given empty literal", function() {
      throws(function() { Must("").be[name]() })
    })

    it("must "+fail+" when called on empty literal", function() {
      throws(function() { "".must.be[name]() })
    })

    it("must "+pass+" given empty object", function() {
      doesNotThrow(function() { Must(new String("")).be[name]() })
    })
  })

  describe("given numbers", function() {
    it("must "+pass+" given literal", function() {
      doesNotThrow(function() { Must(1).be[name]() })
    })

    it("must "+pass+" when called on literal", function() {
      doesNotThrow(function() { (1).must.be[name]() })
    })

    it("must "+pass+" given object", function() {
      doesNotThrow(function() { Must(new Number(1)).be[name]() })
    })

    it("must "+fail+" given zero literal", function() {
      throws(function() { Must(0).be[name]() })
    })

    it("must "+fail+" when called on zero literal", function() {
      throws(function() { (0).must.be[name]() })
    })

    it("must "+pass+" given zero object", function() {
      doesNotThrow(function() { Must(new Number(0)).be[name]() })
    })
  })

  describe("given dates", function() {
    it("must "+pass+" when called on zero object", function() {
      doesNotThrow(function() { new Date(0).must.be[name]() })
    })
  })

  describe("given arrays", function() {
    it("must "+pass+" given empty literal", function() {
      doesNotThrow(function() { Must([]).be[name]() })
    })

    it("must "+pass+" when called on empty literal", function() {
      doesNotThrow(function() { [].must.be[name]() })
    })

    it("must "+pass+" given empty object", function() {
      doesNotThrow(function() { Must(new Array).be[name]() })
    })
  })

  describe("given objects", function() {
    it("must "+pass+" given empty literal", function() {
      doesNotThrow(function() { Must({}).be[name]() })
    })

    it("must "+pass+" when called on empty literal", function() {
      doesNotThrow(function() { ({}).must.be[name]() })
    })

    it("must "+pass+" given empty object", function() {
      doesNotThrow(function() { Must(new Object).be[name]() })
    })
  })

  it("must not do anything when not called as a function", function() {
    assert.doesNotThrow(function() { Must(!truthy).be[name] })
  })

  mustThrowAssertionError(function() { (!truthy).must.be[name]() }, {
    actual: !truthy,
    message: !truthy + " must be " + name
  })

  describe(".not", function() {
    it("must inverse the assertion", function() {
      assert.throws(function() { truthy.must.not.be[name]() })
    })

    mustThrowAssertionError(function() { truthy.must.not.be[name]() }, {
      actual: truthy,
      message: truthy + " must not be " + name
    })
  })
}

describe("Must.prototype.truthy", function() {
  mustPassTruthy("truthy", true)
})

describe("Must.prototype.ok", function() {
  it("must be an alias of Must.prototype.truthy", function() {
    assert.strictEqual(Must.prototype.ok, Must.prototype.truthy)
  })
})

describe("Must.prototype.falsy", function() {
  mustPassTruthy("falsy", false)
})

describe("Must.prototype.instanceof", function() {
  describe("given Boolean", function() {
    it("must fail given boolean literal", function() {
      assert.throws(function() { true.must.be.instanceof(Boolean) })
      assert.throws(function() { false.must.be.instanceof(Boolean) })
    })

    it("must pass given boolean object", function() {
      assert.doesNotThrow(function() {
        Must(new Boolean()).be.instanceof(Boolean)
      })
    })

    it("must fail given boolean object when called on", function() {
      assert.throws(function() { new Boolean().must.be.instanceof(Boolean) })
    })

    it("must fail given Boolean constructor", function() {
      assert.throws(function() { Boolean.must.be.instanceof(Boolean) })
    })
  })

  describe("given Number", function() {
    it("must fail given number literal", function() {
      assert.throws(function() { (42).must.be.instanceof(Number) })
    })

    it("must pass given number object", function() {
      assert.doesNotThrow(function() {
        Must(new Number()).be.instanceof(Number)
      })
    })

    it("must fail given number object when called on", function() {
      assert.throws(function() { new Number().must.be.instanceof(Number) })
    })

    it("must fail given Number constructor", function() {
      assert.throws(function() { Number.must.be.instanceof(Number) })
    })
  })

  describe("given String", function() {
    it("must fail given string literal", function() {
      assert.throws(function() { "".must.be.instanceof(String) })
    })

    it("must pass given string object", function() {
      assert.doesNotThrow(function() {
        Must(new String()).be.instanceof(String)
      })
    })

    it("must fail given string object when called on", function() {
      assert.throws(function() { new String().must.be.instanceof(String) })
    })

    it("must fail given String constructor", function() {
      assert.throws(function() { String.must.be.instanceof(String) })
    })
  })

  describe("given Array", function() {
    it("must pass given array literal", function() {
      assert.doesNotThrow(function() { [].must.be.instanceof(Array) })
    })

    it("must pass given array object and Array", function() {
      assert.doesNotThrow(function() { new Array().must.be.instanceof(Array) })
    })

    it("must fail given Array constructor", function() {
      assert.throws(function() { Array.must.be.instanceof(Array) })
    })
  })

  describe("given RegExp", function() {
    it("must pass given RegExp literal", function() {
      assert.doesNotThrow(function() { /a/.must.be.instanceof(RegExp) })
    })

    it("must pass given regexp object and RegExp", function() {
      assert.doesNotThrow(function() {
        new RegExp().must.be.instanceof(RegExp) 
      })
    })

    it("must fail given RegExp constructor", function() {
      assert.throws(function() { RegExp.must.be.instanceof(RegExp) })
    })
  })

  describe("given custom constructor", function() {
    function Foo() {}
    function Bar() {}

    it("must pass given an instance of it", function() {
      assert.doesNotThrow(function() { new Foo().must.be.instanceof(Foo) })
    })

    it("must pass given an instance of it and Object", function() {
      assert.doesNotThrow(function() { new Foo().must.be.instanceof(Object) })
    })

    it("must fail given an instance of another", function() {
      assert.throws(function() { new Bar().must.be.instanceof(Foo) })
    })
  })

  mustThrowAssertionError(function() { [].must.be.instanceof(String) }, {
    actual: [],
    expected: String,
    message: "[] must be an instance of String"
  })

  describe(".not", function() {
    it("must inverse the assertion", function() {
      assert.throws(function() { [].must.not.be.instanceof(Array) })
    })

    mustThrowAssertionError(function() { [].must.not.be.instanceof(Array) }, {
      actual: [],
      expected: Array,
      message: "[] must not be an instance of Array"
    })
  })
})

describe("Must.prototype.instanceOf", function() {
  it("must be an alias of Must.prototype.instanceof", function() {
    assert.strictEqual(Must.prototype.instanceOf, Must.prototype.instanceof)
  })
})

describe("Must.prototype.equal", function() {
  it("must pass given nulls", function() {
    assert.doesNotThrow(function() { Must(null).be.equal(null) })
  })

  it("must pass given undefineds", function() {
    assert.doesNotThrow(function() { Must(undefined).be.equal(undefined) })
  })

  it("must fail given null and undefined", function() {
    assert.throws(function() { Must(null).be.equal(undefined) })
  })

  it("must fail given undefined and null", function() {
    assert.throws(function() { Must(undefined).be.equal(null) })
  })

  describe("given booleans", function() {
    function mustPassTrueEqual(bool) {
      it("must pass given "+bool+" literals", function() {
        assert.doesNotThrow(function() { Must(bool).be.equal(bool) })
      })

      it("must pass given "+bool+" literals when calling on", function() {
        assert.doesNotThrow(function() { bool.must.be.equal(bool) })
      })

      it("must fail given "+bool+" literal and object", function() {
        assert.throws(function() { Must(bool).be.equal(new Boolean(bool)) })
      })

      it("must fail given "+bool+" object and literal", function() {
        assert.throws(function() { Must(new Boolean(bool)).be.equal(bool) })
      })

      it("must fail given "+bool+" literal with "+!bool, function() {
        assert.throws(function() { Must(bool).be.equal(!bool) })
      })
    }

    mustPassTrueEqual(true)
    mustPassTrueEqual(false)
  })

  describe("given numbers", function() {
    it("must pass given equivalent literals", function() {
      assert.doesNotThrow(function() { Must(42).be.equal(42) })
    })

    it("must pass given equivalent literals when calling on", function() {
      assert.doesNotThrow(function() { (42).must.be.equal(42) })
    })

    it("must fail given unequivalent literals", function() {
      assert.throws(function() { Must(42).be.equal(1337) })
    })

    it("must fail given unequivalent literal when calling on", function() {
      assert.throws(function() { (42).must.be.equal(1337) })
    })

    it("must fail given equivalent literal and object", function() {
      assert.throws(function() { Must(42).be.equal(new Number(42)) })
    })

    it("must fail given equivalent object and literal", function() {
      assert.throws(function() { Must(new Number(42)).be.equal(42) })
    })
  })

  describe("given strings", function() {
    it("must pass given equivalent literals", function() {
      assert.doesNotThrow(function() { Must("ok").be.equal("ok") })
    })

    it("must pass given equivalent literals when calling on", function() {
      assert.doesNotThrow(function() { "ok".must.be.equal("ok") })
    })

    it("must fail given unequivalent literals", function() {
      assert.throws(function() { Must("ok").be.equal("nok") })
    })

    it("must fail given unequivalent literals when calling on", function() {
      assert.throws(function() { "ok".must.be.equal("nok") })
    })

    it("must fail given equivalent literal and object", function() {
      assert.throws(function() { Must("ok").be.equal(new String("ok")) })
    })

    it("must fail given equivalent object and literal", function() {
      assert.throws(function() { Must(new String("ok")).be.equal("ok") })
    })
  })

  describe("given dates", function() {
    it("must pass given identical objects", function() {
      var now = new Date
      assert.doesNotThrow(function() { Must(now).be.equal(now) })
    })

    it("must pass given identical objects when calling on", function() {
      var now = new Date
      assert.doesNotThrow(function() { now.must.be.equal(now) })
    })

    it("must fail given equivalent objects", function() {
      assert.throws(function() { Must(new Date(42)).be.equal(new Date(42)) })
    })

    it("must fail given equivalent objects when calling on", function() {
      assert.throws(function() { new Date(42).must.be.equal(new Date(42)) })
    })
  })

  describe("given regexps", function() {
    it("must fail given equivalent literals", function() {
      assert.throws(function() { Must(/a/).be.equal(/a/) })
    })

    it("must fail given equivalent literals when calling on", function() {
      assert.throws(function() { /a/.must.be.equal(/a/) })
    })

    it("must fail given unequivalent literals", function() {
      assert.throws(function() { Must(/a/).be.equal(/b/) })
    })

    it("must fail given unequivalent literals when calling on", function() {
      assert.throws(function() { /a/.must.be.equal(/b/) })
    })

    it("must pass given identical objects", function() {
      var regexp = new RegExp
      assert.doesNotThrow(function() { Must(regexp).be.equal(regexp) })
    })

    it("must pass given identical objects when calling on", function() {
      var regexp = new RegExp
      assert.doesNotThrow(function() { regexp.must.be.equal(regexp) })
    })

    it("must fail given equivalent objects", function() {
      assert.throws(function() { Must(new RegExp).be.equal(new RegExp) })
    })

    it("must fail given equivalent objects when calling on", function() {
      assert.throws(function() { new RegExp().must.be.equal(new RegExp) })
    })
  })

  describe("given arrays", function() {
    it("must fail given equivalent literals", function() {
      assert.throws(function() { Must([1]).be.equal([1]) })
    })

    it("must fail given equivalent literals when calling on", function() {
      assert.throws(function() { [1].must.be.equal([1]) })
    })

    it("must pass given identical objects", function() {
      var array = new Array
      assert.doesNotThrow(function() { Must(array).be.equal(array) })
    })

    it("must pass given identical objects when calling on", function() {
      var array = new Array
      assert.doesNotThrow(function() { array.must.be.equal(array) })
    })

    it("must fail given unidentical objects", function() {
      assert.throws(function() { Must(new Array()).be.equal(new Array) })
    })

    it("must fail given unidentical objects when calling on", function() {
      assert.throws(function() { new Array().must.be.equal(new Array) })
    })
  })

  mustThrowAssertionError(function() { "secret".must.equal(42) }, {
    actual: "secret",
    expected: 42,
    message: "\"secret\" must equal 42"
  })

  describe(".not", function() {
    it("must inverse the assertion", function() {
      assert.throws(function() { "secret".must.not.equal("secret") })
    })

    mustThrowAssertionError(function() { "secret".must.not.equal("secret") }, {
      actual: "secret",
      expected: "secret",
      message: "\"secret\" must not equal \"secret\""
    })
  })
})

describe("Must.prototype.eql", function() {
  it("must pass given nulls", function() {
    assert.doesNotThrow(function() { Must(null).be.eql(null) })
  })

  it("must pass given undefineds", function() {
    assert.doesNotThrow(function() { Must(undefined).be.eql(undefined) })
  })

  it("must pass given null and undefined", function() {
    assert.doesNotThrow(function() { Must(null).be.eql(undefined) })
  })

  it("must pass given undefined and null", function() {
    assert.doesNotThrow(function() { Must(undefined).be.eql(null) })
  })

  describe("given booleans", function() {
    function mustPassTrueEql(bool) {
      it("must pass given "+bool+" literals", function() {
        assert.doesNotThrow(function() { Must(bool).be.eql(bool) })
      })

      it("must pass given "+bool+" literals when calling on", function() {
        assert.doesNotThrow(function() { bool.must.be.eql(bool) })
      })

      it("must pass given "+bool+" literal and object", function() {
        assert.doesNotThrow(function() { Must(bool).be.eql(new Boolean(bool)) })
      })

      it("must pass given "+bool+" object and literal", function() {
        assert.doesNotThrow(function() { Must(new Boolean(bool)).be.eql(bool) })
      })

      it("must fail given "+bool+" literal with "+!bool, function() {
        assert.throws(function() { Must(bool).be.eql(!bool) })
      })
    }

    mustPassTrueEql(true)
    mustPassTrueEql(false)
  })

  describe("given numbers", function() {
    it("must pass given equivalent literals", function() {
      assert.doesNotThrow(function() { Must(42).be.eql(42) })
    })

    it("must pass given equivalent literals when calling on", function() {
      assert.doesNotThrow(function() { (42).must.be.eql(42) })
    })

    it("must pass given equivalent literal and object", function() {
      assert.doesNotThrow(function() { Must(42).be.eql(new Number(42)) })
    })

    it("must pass given equivalent object and literal", function() {
      assert.doesNotThrow(function() { Must(new Number(42)).be.eql(42) })
    })

    it("must fail given unequivalent literals", function() {
      assert.throws(function() { Must(42).be.eql(1337) })
    })

    it("must fail given unequivalent literals when calling on", function() {
      assert.throws(function() { (42).must.be.eql(1337) })
    })
  })

  describe("given strings", function() {
    it("must pass given equivalent literals", function() {
      assert.doesNotThrow(function() { Must("ok").be.eql("ok") })
    })

    it("must pass given equivalent literals when calling on", function() {
      assert.doesNotThrow(function() { "ok".must.be.eql("ok") })
    })

    it("must pass given equivalent literal and object", function() {
      assert.doesNotThrow(function() { Must("ok").be.eql(new String("ok")) })
    })

    it("must pass given equivalent object and literal", function() {
      assert.doesNotThrow(function() { Must(new String("ok")).be.eql("ok") })
    })

    it("must fail given unequivalent literals", function() {
      assert.throws(function() { Must("ok").be.eql("nok") })
    })

    it("must fail given unequivalent literals when calling on", function() {
      assert.throws(function() { "ok".must.be.eql("nok") })
    })
  })

  describe("given dates", function() {
    it("must pass given identical objects", function() {
      var now = new Date
      assert.doesNotThrow(function() { Must(now).be.eql(now) })
    })

    it("must pass given identical objects when calling on", function() {
      var now = new Date
      assert.doesNotThrow(function() { now.must.be.eql(now) })
    })

    it("must pass given equivalent objects", function() {
      assert.doesNotThrow(function() { Must(new Date(7)).be.eql(new Date(7)) })
    })

    it("must pass given equivalent objects when calling on", function() {
      assert.doesNotThrow(function() { new Date(7).must.be.eql(new Date(7)) })
    })

    it("must fail given unequivalent objects", function() {
      assert.throws(function() { Must(new Date(69)).be.eql(new Date(42)) })
    })

    it("must fail given unequivalent objects when calling on", function() {
      assert.throws(function() { new Date(69).must.be.eql(new Date(42)) })
    })
  })

  describe("given regexps", function() {
    it("must pass given equivalent literals", function() {
      assert.doesNotThrow(function() { Must(/a/).be.eql(/a/) })
    })

    it("must pass given equivalent literals when calling on", function() {
      assert.doesNotThrow(function() { /a/.must.be.eql(/a/) })
    })

    it("must fail given unequivalent literals", function() {
      assert.throws(function() { Must(/a/).be.eql(/b/) })
    })

    it("must fail given unequivalent literals when calling on", function() {
      assert.throws(function() { /a/.must.be.eql(/b/) })
    })

    it("must pass given equivalent objects", function() {
      assert.doesNotThrow(function() { Must(new RegExp).be.eql(new RegExp) })
    })

    it("must pass given equivalent objects when calling on", function() {
      assert.doesNotThrow(function() { new RegExp().must.be.eql(new RegExp) })
    })

    it("must fail given unequivalent objects", function() {
      assert.throws(function() {Must(new RegExp("a")).be.eql(new RegExp("b"))})
    })

    it("must fail given unequivalent objects when calling on", function() {
      assert.throws(function() { new RegExp("a").must.be.eql(new RegExp("b")) })
    })
  })

  describe("given arrays", function() {
    it("must fail given equivalent literals", function() {
      assert.throws(function() { Must([1]).be.eql([1]) })
    })

    it("must fail given equivalent literals when calling on", function() {
      assert.throws(function() { [1].must.be.eql([1]) })
    })

    it("must pass given identical objects", function() {
      var array = new Array
      assert.doesNotThrow(function() { Must(array).be.eql(array) })
    })

    it("must pass given identical objects when calling on", function() {
      var array = new Array
      assert.doesNotThrow(function() { array.must.be.eql(array) })
    })

    it("must fail given unidentical objects", function() {
      assert.throws(function() { Must(new Array()).be.eql(new Array) })
    })

    it("must fail given unidentical objects when calling on", function() {
      assert.throws(function() { new Array().must.be.eql(new Array) })
    })
  })

  mustThrowAssertionError(function() { "secret".must.eql(42) }, {
    actual: "secret",
    expected: 42,
    message: "\"secret\" must == 42"
  })

  describe(".not", function() {
    it("must inverse the assertion", function() {
      assert.throws(function() { "secret".must.not.eql("secret") })
    })

    mustThrowAssertionError(function() { "secret".must.not.eql("secret") }, {
      actual: "secret",
      expected: "secret",
      message: "\"secret\" must not == \"secret\""
    })
  })
})