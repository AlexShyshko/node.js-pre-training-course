import { TodoApi } from '../JS-TS/solutions/todo-api';
import { InMemoryRepository } from '../JS-TS/solutions/repository';
import { TodoService } from '../JS-TS/solutions/todo-service';
import { Todo, TodoStatus } from '../JS-TS/solutions/types';

describe('Task 09: Unit Tests for Business Logic', () => {
    jest.setTimeout(10000);

    let repo: InMemoryRepository<typeof entityTemplate1>;
    const entityTemplate1 = {
        id: 1,
        genericProperty: 'test property 1'
    }
    const entityTemplate2 = {
        id: 2,
        genericProperty: 'test property 2'
    }
    const entityTemplateUpdate = {
        genericProperty: 'test property updated'
    }

    let service: TodoService;
    const newTodoTemplate = {
        title: 'newTitle',
        description: 'newDescription'
    }
    const newTodoTemplateNoDescription = {
        title: 'titleForNoDescriptionTemplate'
    }
    const todoTemplateToggled = {
        title: 'newTitle',
        status: TodoStatus.IN_PROGRESS,
        description: 'newDescription'
    }
    const todoTemplateNoDescriptionToggled = {
        title: 'titleForNoDescriptionTemplate',
        status: TodoStatus.IN_PROGRESS
    }
    const todoTemplateStatusUpdate = {
        status: TodoStatus.COMPLETED,
    }

    beforeEach(() => {
        repo = new InMemoryRepository();
        service = new TodoService(new TodoApi());
    });

    it('InMemoryRepository - add new generic template', () => {
        const addCase = repo.add(entityTemplate1);
        expect(addCase).toBe(entityTemplate1);
    });
    it('InMemoryRepository - update generic template', () => {
        const addCase = repo.add(entityTemplate1);
        const updateCase = repo.update(addCase.id, entityTemplateUpdate);
        expect(updateCase.id).toBe(entityTemplate1.id);
        expect(updateCase.genericProperty).toBe(entityTemplateUpdate.genericProperty);
        expect(() => repo.update(2, entityTemplateUpdate)).toThrow();
    });
    it('InMemoryRepository - remove generic template', () => {
        const addCase = repo.add(entityTemplate1);
        const addCaseId = addCase.id;
        repo.remove(addCaseId);
        const removeCase = repo.findById(addCaseId);
        expect(removeCase).toBeUndefined();
    });
    it('InMemoryRepository - findById generic template', () => {
        const addCase1 = repo.add(entityTemplate1);
        const addCase2 = repo.add(entityTemplate2);
        const findCase1 = repo.findById(addCase1.id);
        const findCase2 = repo.findById(addCase2.id);
        const findCaseUndefined = repo.findById(3);
        expect(findCase1).toBe(entityTemplate1);
        expect(findCase2).toBe(entityTemplate2);
        expect(findCaseUndefined).toBeUndefined();
    });
    it('InMemoryRepository - findAll generic template', () => {
        const addCase1 = repo.add(entityTemplate1);
        const addCase2 = repo.add(entityTemplate2);
        const findAllCase = repo.findAll();
        expect(findAllCase).toEqual([
            addCase1,
            addCase2
        ]);
    });
    it('TodoService - create new Todo template', async () => {
        const createdCase = await service.create(newTodoTemplate.title, newTodoTemplate.description);
        const createdNoDescriptionCase = await service.create(newTodoTemplateNoDescription.title);
        expect(createdCase).toMatchObject(newTodoTemplate);
        expect(createdNoDescriptionCase).toMatchObject(newTodoTemplateNoDescription);
    });
    it('TodoService - toggleStatus Todo template', async () => {
        const createdCase = await service.create(newTodoTemplate.title, newTodoTemplate.description);
        const createdNoDescriptionCase = await service.create(newTodoTemplateNoDescription.title);
        const toggledCase = await service.toggleStatus(createdCase.id);
        const toggledNoDescriptionCase = await service.toggleStatus(createdNoDescriptionCase.id);
        expect(toggledCase).toMatchObject(todoTemplateToggled);
        expect(toggledNoDescriptionCase).toMatchObject(todoTemplateNoDescriptionToggled);
    });
    it('TodoService - setStatus Todo template', async () => {
        const createdCase = await service.create(newTodoTemplate.title, newTodoTemplate.description);
        const createdNoDescriptionCase = await service.create(newTodoTemplateNoDescription.title);
        expect(createdCase.status).toBe(TodoStatus.PENDING);
        expect(createdNoDescriptionCase.status).toBe(TodoStatus.PENDING);
        const updatedStatusCase = await service.setStatus(createdCase.id, todoTemplateStatusUpdate.status);
        const updatedStatusNoDescriptionCase = await service.setStatus(createdNoDescriptionCase.id, todoTemplateStatusUpdate.status);
        expect(updatedStatusCase.status).toBe(todoTemplateStatusUpdate.status);
        expect(updatedStatusNoDescriptionCase.status).toBe(todoTemplateStatusUpdate.status);
        await expect(service.setStatus(3, todoTemplateStatusUpdate.status)).rejects.toThrow();
    });
    it('TodoService - search Todo template', async () => {
        const createdCase = await service.create(newTodoTemplate.title, newTodoTemplate.description);
        const createdNoDescriptionCase = await service.create(newTodoTemplateNoDescription.title);
        const searchDescriptionCase = await service.search(newTodoTemplate.description);
        const searchTitleCase = await service.search(newTodoTemplateNoDescription.title);
        const searchNonExistent = await service.search('Todo does not exist');
        expect(searchDescriptionCase).toEqual([createdCase]);
        expect(searchTitleCase).toEqual([createdNoDescriptionCase]);
        expect(searchNonExistent).toEqual([]);
        await expect(service.search('')).rejects.toThrow();
    });

});

// line coverage check
// npx jest --coverage --testPathPatterns=js-ts-task-09

// run single file test
// npx jest tests/js-ts-task-09.test.ts