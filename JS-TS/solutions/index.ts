#!/usr/bin/env ts-node
// CLI entry for Task 10 – placeholder only
import { ToDoManager } from './todo-manager';

const appManager = new ToDoManager();
const mc = appManager.colorize;

async function main() {

    printGreeting();
    printHelp();

    process.stdin.setEncoding('utf8');
    printEnterCommand();

    process.stdin.on('data', async (chunk: string) => {
        const trimmed = chunk.trim();

        if (!trimmed) {
            printEnterCommand();
            return;
        }

        const [command, ...args] = trimmed.split(/\s+/);

        if (command.toLowerCase() === 'exit') {
            console.log(mc('Exiting application. Goodbye!', 'cyan'));
            process.stdin.pause();
            return;
        }

        try {

            switch (command.toLowerCase()) {

                case 'seed': {
                    await appManager.init();
                    break;
                }

                case 'list': {
                    await appManager.list();
                    break;
                }

                case 'add': {
                    const payload = args.join(' ');
                    const [rawTitle, rawDescription] = payload.split('|');
                    const title = rawTitle?.trim();
                    const description = rawDescription?.trim();

                    if (!title) {
                        console.log(mc('Title is required. Type "help" to see instruction.', 'red'));
                        break;
                    }

                    await appManager.add(title, description || undefined);
                    break;
                }

                case 'complete': {
                    const id = Number(args);

                    if (!args || Number.isNaN(id)) {
                        console.log(mc('Valid numeric ID is required. Type "help" to see instruction.', 'red'));
                        break;
                    }

                    await appManager.complete(id);
                    break;
                }

                case 'help': {
                    printHelp();
                    break;
                }

                default: {
                    console.log(mc('Unknown command. Type "help" to see instruction.', 'red'));
                }
            }

        } catch (error) {
            console.log(mc('Command error:', 'red'));
            console.error(error);
        }

        printEnterCommand();
    });

}

function printGreeting() {
    console.log(`${mc('\nHello! This is a simple CLI for a simple APP.', 'cyan')}`);
    console.log(`${mc('The task was completed and all tests successfully passed on NodeJS', 'cyan')} ${mc('26.13.1.', 'yellow_bgc')}`);
    console.log(`${mc('Enjoy!\n', 'cyan')}`);

}

function printHelp() {
    console.log(`${mc('Available commands:', 'green')}\n`);

    console.log(`${mc('seed', 'yellow')}                          ${mc('- Seed in-memory DB with demo data', 'green')}`);
    console.log(`${mc('Example:', 'magenta')} ${mc('seed', 'magenta_bgc')}\n`);

    console.log(`${mc('list', 'yellow')}                          ${mc('- Show all Todos', 'green')}`);
    console.log(`${mc('Example:', 'magenta')} ${mc('list', 'magenta_bgc')}\n`);

    console.log(`${mc('add <TITLE> | <DESCRIPTION>', 'yellow')}   ${mc('- Add a new Todo (description is optional)', 'green')}`);
    console.log(`${mc('Example:', 'magenta')} ${mc('add Friday deploy | To visit a church if changes not bring down prod', 'magenta_bgc')}\n`);

    console.log(`${mc('complete <ID NUMBER>', 'yellow')}          ${mc('- Mark Todo as completed', 'green')}`);
    console.log(`${mc('Example:', 'magenta')} ${mc('complete 1', 'magenta_bgc')}\n`);

    console.log(`${mc('help', 'yellow')}                          ${mc('- Show this help menu', 'green')}`);
    console.log(`${mc('Example:', 'magenta')} ${mc('help', 'magenta_bgc')}\n`);

    console.log(`${mc('exit', 'yellow')}                          ${mc('- Exit the application', 'green')}`);
    console.log(`${mc('Example:', 'magenta')} ${mc('exit', 'magenta_bgc')}\n`);
}

function printEnterCommand() {
    process.stdout.write(mc('Enter command >', 'white_bgc') + ' ');
}

main().catch((error) => {
    console.log(mc('CLI error. Application will be forcefully terminated.', 'red'));
    process.exitCode = 1;
});

// run application with ts-node installed globally
// npx ts-node JS-TS/solutions/index.ts