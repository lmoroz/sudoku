module.exports = function solveSudoku(matrix) {

    const steps_stack = [];

    const solve_recursion = (m, step_count = 0, total_count = 0, step_back = false) => {
        if (step_back) {
            //if (!steps_stack.length) throw new Error('Это какая-то неправильная судоку :(');
            let [step_count, row_i, col_i, cell_variants, new_matrix] = steps_stack.pop();

            const next_insert_num = cell_variants.shift();
            if (cell_variants.length)
                steps_stack.push([step_count, row_i, col_i, cell_variants, new_matrix.map(r => [...r])]);

            new_matrix[row_i][col_i] = next_insert_num;

            return solve_recursion(new_matrix, ++step_count, ++total_count);
        }

        const new_matrix = m.map(r => [...r]),
            row_nums = [],
            col_nums = [],
            empty_cells = [],
            cells_variants = [];
        const bigcell_nums = {};

        let easiest_cells;

        m.forEach((row, row_i) => {
            row_nums[row_i] = row.filter(n => n > 0);
            row.forEach((num, col_i) => {
                col_nums[col_i] = (col_nums[col_i] || []);
                const bigcell_id = ~~(row_i / 3) + ',' + ~~(col_i / 3);
                if (num) {
                    col_nums[col_i].push(num);
                    bigcell_nums[bigcell_id] = (bigcell_nums[bigcell_id] || []).concat([num]);
                    return;
                }
                empty_cells.push([row_i, col_i]);

            });
        });
        if (!empty_cells.length) return m;

        let error = false;
        empty_cells.some(coords => {
            const [row_i, col_i] = coords;
            const bigcell_id = ~~(row_i / 3) + ',' + ~~(col_i / 3);
            const all_nums = [
                ...new Set([...row_nums[row_i], ...col_nums[col_i], ...(bigcell_nums[bigcell_id] || [])]),
            ].sort();
            const cell_variants = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => !all_nums.includes(num));
            if (!cell_variants.length) {
                error = true;
                return error;
            }
            if (cell_variants.length === 1) {
                new_matrix[row_i][col_i] = cell_variants.shift();
                return true;
            }
            cells_variants[coords] = cell_variants;
        });
        if (error) {
            return solve_recursion([], 0, ++total_count, true);
        }
        if (JSON.stringify(new_matrix) !== JSON.stringify(m))
            return solve_recursion(new_matrix, ++step_count, ++total_count);

        const sorting_func = (a, b) => {
            return cells_variants[a].length - cells_variants[b].length;
        };

        easiest_cells = Object.keys(cells_variants).sort(sorting_func);

        const next_easy_cell_key = easiest_cells.shift();
        const next_insert_num = cells_variants[next_easy_cell_key].shift();
        const [row_i, col_i] = next_easy_cell_key.split(',');

        steps_stack.push(
            [step_count, row_i, col_i, cells_variants[next_easy_cell_key], new_matrix.map(r => [...r])]);

        new_matrix[row_i][col_i] = next_insert_num;

        return solve_recursion(new_matrix, ++step_count, ++total_count);

    };
    return solve_recursion(matrix);
};

