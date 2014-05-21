(function() {
    'use strict';

    describe('Observable', function() {
        var ObservableProvider,
            Observable;

        var object;

        var AsEvented;

        beforeEach(function() {
            AsEvented = require('../../node_modules/asEvented/asevented');

            ObservableProvider = require('../../lib/ObservableProvider');
            Observable = new ObservableProvider({ asEvented: AsEvented });

            object = new Observable({
                name: 'Josh',
                address: {
                    street: '10 Patrick Dr.',
                    city: 'Pittstown',
                    state: 'NJ',
                    zip: '08867'
                },
                mother: {
                    name: 'Louan',
                    mother: {
                        name: 'Virginia'
                    }
                }
            });
        });

        it('should exist', function() {
            expect(object).toEqual(jasmine.any(Observable));
        });

        describe('methods', function() {
            describe('get(prop)', function() {
                it('should get the property', function() {
                    expect(object.get()).toBe(object);

                    ['name', 'address', 'mother'].forEach(function(prop) {
                        expect(object.get(prop)).toBe(object[prop]);
                    });

                    ['street', 'city', 'state', 'zip'].forEach(function(prop) {
                        expect(object.get('address.' + prop)).toBe(object.address[prop]);
                    });

                    ['name', 'mother'].forEach(function(prop) {
                        expect(object.get('mother.' + prop)).toBe(object.mother[prop]);
                    });

                    expect(object.get('mother.mother.name')).toBe(object.mother.mother.name);
                });

                it('should be forgiving of getting properties of undefined', function() {
                    expect(object.get('mother.father.name')).toBeUndefined();
                });
            });

            describe('set(prop, value)', function() {
                it('should set the property', function() {
                    object.set('name', 'Jessica');
                    expect(object.name).toBe('Jessica');

                    object.set('address.street', '10 Patrick Drive');
                    expect(object.address.street).toBe('10 Patrick Drive');

                    object.set('mother.mother.name', 'Ella');
                    expect(object.mother.mother.name).toBe('Ella');
                });
            });

            describe('observe(prop, cb)', function() {
                var name, addressZip, motherName, motherMotherName, name2;

                beforeEach(function() {
                    name = jasmine.createSpy('observe name');
                    addressZip = jasmine.createSpy('observe address.zip');
                    motherName = jasmine.createSpy('observe mother.name');
                    motherMotherName = jasmine.createSpy('observe mother.mother.name');
                    name2 = jasmine.createSpy('observe name (2)');

                    object
                        .observe('name', name)
                        .observe('name', name2)
                        .observe('address.zip', addressZip)
                        .observe('mother.name', motherName)
                        .observe('mother.mother.name', motherMotherName);
                });

                afterEach(function() {
                    [name, addressZip, motherName, motherMotherName, name2].forEach(function(spy) {
                        expect(spy.calls.mostRecent().object).toBe(object);
                    });
                });

                it('should initialize all of the observers', function() {
                    expect(name).toHaveBeenCalledWith(object.name);
                    expect(name2).toHaveBeenCalledWith(object.name);
                    expect(addressZip).toHaveBeenCalledWith(object.address.zip);
                    expect(motherName).toHaveBeenCalledWith(object.mother.name);
                    expect(motherMotherName).toHaveBeenCalledWith(object.mother.mother.name);
                });

                it('should notify the observers when the property changes', function() {
                    object.set('name', 'Jessica');
                    [name, name2].forEach(function(observer) {
                        expect(observer).toHaveBeenCalledWith('Jessica');
                    });

                    object.set('address.zip', '08542');
                    expect(addressZip).toHaveBeenCalledWith('08542');

                    object.set('mother.name', 'Louisean');
                    expect(motherName).toHaveBeenCalledWith('Louisean');

                    object.set('mother.mother.name', 'Ella');
                    expect(motherMotherName).toHaveBeenCalledWith('Ella');

                    object.set('name', 'Dan');
                    [name, name2].forEach(function(observer) {
                        expect(observer).toHaveBeenCalledWith('Dan');
                    });
                });

                it('should only notify the observer if the value actually changes', function() {
                    object.set('name', 'Josh');
                    expect(name.calls.count()).toBe(1);
                    expect(name2.calls.count()).toBe(1);

                    object.set('name', 'Audrey');
                    expect(name.calls.count()).toBe(2);
                    expect(name2.calls.count()).toBe(2);

                    object.set('name', 'Audrey');
                    expect(name.calls.count()).toBe(2);
                    expect(name2.calls.count()).toBe(2);

                    object.set('mother.mother.name', 'Virginia');
                    expect(motherMotherName.calls.count()).toBe(1);
                });
            });

            describe('ignore(prop, cb)', function() {
                var name, name2;

                beforeEach(function() {
                    name = jasmine.createSpy('observe name');
                    name2 = jasmine.createSpy('observe name (2)');

                    object
                        .observe('name', name)
                        .observe('name', name2);

                    [name, name2].forEach(function(spy) {
                        spy.calls.reset();
                    });

                    object.ignore('name', name2);
                });

                it('should stop tiggering the callback when the property changes', function() {
                    object.set('name', 'Jessica');

                    expect(name).toHaveBeenCalledWith('Jessica');
                    expect(name2).not.toHaveBeenCalled();
                });

                it('should be resilient against ignoring non-observed properties', function() {
                    expect(function() {
                        object.ignore('mother.mother.name', function() {});
                        object.ignore('name', function() {});
                    }).not.toThrow();
                });
            });
        });
    });
}());
