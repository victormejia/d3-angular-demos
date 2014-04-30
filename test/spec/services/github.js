'use strict';

describe('Service: GitHub', function () {

  // load the service's module
  beforeEach(module('d3AngularDemosApp'));

  // instantiate service
  var GitHub;
  beforeEach(inject(function (_GitHub_) {
    GitHub = _GitHub_;
  }));

  it('should do something', function () {
    expect(!!GitHub).toBe(true);
  });

});
