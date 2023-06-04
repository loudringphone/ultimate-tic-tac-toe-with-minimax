# Ultimate Tic Tac Toe with Minimax


You can try the game on https://loudringphone.github.io/ultimate-tic-tac-toe-with-minimax/


Unlike the simple Tic Tac Toe that only needs the basic form of minimax, Ultimate Tic Tac Toe(UTT) requires board evaluation and alpha beta pruning. A maximium depth is also required to determine how far the algorithm will search into the game tree as otherwise it will exhaust all the computational resources.


Please note that minimax use computational resources to explore the game tree, so preferably run the game on your laptop or PC instead of on your mobile.

<br>

## Rules of the game
The game starts with X playing wherever they want in any of the 81 empty spots. This move "sends" their opponent to its relative location. For example, if X played in the top right square of their local board, then O needs to play next in the local board at the top right of the global board. O can then play in any one of the nine available spots in that local board, each move sending X to a different local board. If a move is played so that it is to win a local board by the rules of normal tic-tac-toe, then the entire local board is marked as a victory for the player in the global board. Once a local board is won by a player or it is filled completely, no more moves may be played in that board. If a player is sent to such a board, then that player may play in any other board. Game play ends when either a player wins the global board or there are no legal moves remaining, in which case the game is a draw.