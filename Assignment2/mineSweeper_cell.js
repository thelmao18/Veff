class Cell{
    constructor(row, col, board) {
        this.row = row;
        this.col = col;
        this.board = board;
        this.mine = false;
        this.revealed = false;
        this.flagged = false;
    }

    flag() {
        if (!this.revealed) {
            this.flagged = !this.flagged;
            return this.flagged;
        }
    }

    reaveal() {
        if (this.revealed && !mine_hit) return;
        this.revealed = true;
        if (this.mine) return true;
        
    }
}