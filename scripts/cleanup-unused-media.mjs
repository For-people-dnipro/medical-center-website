import https from "https";
import readline from "readline";

const API_BASE = "https://api.forpeople.com.ua";
const TOKEN =
    "b28ac85f2fc204530633c6df947e10ff819e90240643e756f83131671f698dc3a946622db3c285ca9f9239467ace0bcaee290f2d963299536183a40312c23984301a7f5f011aa5abe4dee079f2fa3e464b0ea9d7a8a3aceca3a22e09d5ca97cf66c2fe764235710466d4e41a6fe86bd689adf755337f1cc3b0b4b42c962ba885";

function request(path) {
    return new Promise((resolve, reject) => {
        const url = `${API_BASE}${path}`;
        const options = {
            headers: { Authorization: `Bearer ${TOKEN}` },
        };
        https
            .get(url, options, (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch {
                        reject(new Error(`Invalid JSON from ${path}`));
                    }
                });
            })
            .on("error", reject);
    });
}

function deleteFile(id) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.forpeople.com.ua",
            path: `/api/upload/files/${id}`,
            method: "DELETE",
            headers: { Authorization: `Bearer ${TOKEN}` },
        };
        const req = https.request(options, (res) => {
            res.resume();
            res.on("end", () => resolve(res.statusCode));
        });
        req.on("error", reject);
        req.end();
    });
}

async function fetchAllFiles() {
    const pageSize = 100;
    let page = 1;
    let all = [];

    while (true) {
        const data = await request(
            `/api/upload/files?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`,
        );
        const items = Array.isArray(data) ? data : data?.results ?? [];
        if (!items.length) break;
        all = all.concat(items);
        if (items.length < pageSize) break;
        page++;
    }

    return all;
}

async function main() {
    console.log("Завантаження списку файлів...\n");

    const files = await fetchAllFiles();
    console.log(`Всього файлів у Media Library: ${files.length}\n`);

    const unused = files.filter((f) => {
        const related = f.related ?? f.relations ?? [];
        return !related.length;
    });

    if (!unused.length) {
        console.log("Невикористаних файлів не знайдено.");
        return;
    }

    console.log(`Невикористаних файлів: ${unused.length}\n`);

    let totalSize = 0;
    unused.forEach((f, i) => {
        const kb = Math.round((f.size || 0));
        totalSize += kb;
        console.log(`  ${i + 1}. [ID:${f.id}] ${f.name} — ${kb}KB`);
    });

    console.log(`\nЗагальний розмір: ~${Math.round(totalSize / 1024)}MB`);
    console.log("\nВИДАЛИТИ всі ці файли з R2 та бази даних? (yes/no)");

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("> ", async (answer) => {
        rl.close();
        if (answer.trim().toLowerCase() !== "yes") {
            console.log("Скасовано.");
            return;
        }

        console.log("\nВидалення...");
        let deleted = 0;
        let failed = 0;

        for (const f of unused) {
            try {
                await deleteFile(f.id);
                console.log(`  ✓ Видалено: ${f.name}`);
                deleted++;
            } catch (err) {
                console.log(`  ✗ Помилка: ${f.name} — ${err.message}`);
                failed++;
            }
        }

        console.log(`\nГотово! Видалено: ${deleted}, помилок: ${failed}`);
    });
}

main().catch(console.error);
