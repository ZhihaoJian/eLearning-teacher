import { loadCourseList } from "../service/AddExam.service";

describe('test loadCourseList', () => {
    test('should load course list', () => {
        expect.assertions(1);
        return loadCourseList().then(res => expect(Array.isArray(res.content)).toBe(true));
    });
});

