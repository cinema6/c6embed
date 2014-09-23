var jasmine = window.parent.jasmine || window.parent.parent.jasmine;

module.exports = jasmine.createSpy('splash').and.returnValue({});
