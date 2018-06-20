import { formatSelectedKey, getRouteParam } from "../common/router_v2";

describe('Function formatSelectedKey', () => {
    test('return value is array', () => {
        expect(Array.isArray(formatSelectedKey([]))).toBe(true);
    });
    test('paramter is an empty array, return value should be an empty array', () => {
        expect(formatSelectedKey([])).toHaveLength(0);
    })
    test('paramter is array of string, return value should has length', () => {
        expect(formatSelectedKey(['classroom', 'room'])).toHaveLength(2);
    });
    test('paramter is array of string, return value should start with "/" ', () => {
        expect(formatSelectedKey(['classroom', 'room'])[0]).toBe('/classroom');
    })
});

describe('Function getRouteParam', () => {
    test('return value must be an Object', () => {
        expect(typeof getRouteParam('')).toBe('object');
    });
    test('param is "roomid=123&name=商业软件1班", the roomid must be 123', () => {
        expect(getRouteParam('?roomid=123&name=商业软件1班').roomid).toBe('123')
    });
    test('param is "roomid=123&name=商业软件1班", the name must be 商业软件1班', () => {
        expect(getRouteParam('?roomid=123&name=商业软件1班').name).toBe('商业软件1班')
    });
})