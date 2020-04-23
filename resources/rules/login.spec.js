
describe('When I add non-empty string', function() {

    it('Then the I get the correct answer', function() {
        result = log_in()
        expect(result).toBe(false);
    });
});



describe('When I add empty string', function() {

    it('Then the I get the correct answer', function() {
        result = log_in()
        expect(result).toBe(true);
    });
});describe('When I add undefined string', function() {

    it('Then the I get the correct answer', function() {
        result = log_in()
        expect(result).toBe(true);
    });
});