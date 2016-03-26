describe('01-base-expectations', function () {
    it('should have a title', function () {
        browser.get(browser.params.url);
        expect(browser.getTitle()).toEqual(browser.params.title);
    });
});