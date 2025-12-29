import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const TESTS_DIR = join(process.cwd(), 'test');

const getTests = () => {
    if (!existsSync(TESTS_DIR)) return [];
    return readdirSync(TESTS_DIR)
        .filter(file => file.endsWith('.test.ts'))
        .map(file => file.replace('.test.ts', ''));
};

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const runTests = (testFiles) => {
    console.log(`\n🚀 Ejecutando tests: ${testFiles.join(', ')}...\n`);
    for (const testName of testFiles) {
        try {
            console.log(`-------------------------------------------`);
            console.log(`🧪 Test: ${testName}`);
            // Ejecutamos jest apuntando al archivo específico en la carpeta test raíz
            execSync(`npx jest test/${testName}.test.ts`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`❌ Error en el test ${testName}`);
        }
    }
    console.log(`\n✅ Proceso finalizado.\n`);
    process.exit(0);
};

const showMenu = () => {
    const tests = getTests();

    if (tests.length === 0) {
        console.log("No se encontraron archivos de test en la carpeta /test.");
        process.exit(1);
    }

    console.log("\n--- AUTOMATIZADOR DE TESTS (ESTRUCTURA PLANA) ---");
    console.log("1. Ejecutar todos los tests");
    console.log("2. Selección manual (Elegir qué test ejecutar)");
    console.log("q. Salir");

    rl.question('\nSelecciona una opción: ', (answer) => {
        if (answer === '1') {
            runTests(tests);
        } else if (answer === '2') {
            showSelectionMenu(tests);
        } else if (answer.toLowerCase() === 'q') {
            process.exit(0);
        } else {
            console.log("Opción no válida.");
            showMenu();
        }
    });
};

const showSelectionMenu = (tests) => {
    console.log("\n--- SELECCIONA EL TEST ---");
    tests.forEach((t, i) => console.log(`${i + 1}. ${t}`));
    console.log("b. Volver");

    rl.question('\nElige el número del test: ', (answer) => {
        if (answer.toLowerCase() === 'b') {
            showMenu();
            return;
        }

        const index = parseInt(answer) - 1;
        if (index >= 0 && index < tests.length) {
            runTests([tests[index]]);
        } else {
            console.log("Selección inválida.");
            showSelectionMenu(tests);
        }
    });
};

showMenu();
