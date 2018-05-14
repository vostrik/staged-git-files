module.exports = function codeToStatus (code) {
  /* =======================================================================================================
  ** PER docs at https://git-scm.com/docs/git-diff-index
  ** Possible status letters are:
  **   A: addition of a file
  **   C: copy of a file into a new one
  **   D: deletion of a file
  **   M: modification of the contents or mode of a file
  **   R: renaming of a file
  **   T: change in the type of the file
  **   U: file is unmerged (you must complete the merge before it can be committed)
  **   X: "unknown" change type (most probably a bug, please report it)
  **
  ** Status letters C and R are always followed by a score
  ** (denoting the percentage of similarity between the source and target of the move or copy).
  ** Status letter M may be followed by a score (denoting the percentage of dissimilarity) for file rewrites.
  ** ======================================================================================================= */

  var map = {
    "A": "Added",
    "C": "Copied",
    "D": "Deleted",
    "M": "Modified",
    "R": "Renamed",
    "T": "Type-Change",
    "U": "Unmerged",
    "X": "Unknown",
    "B": "Broken"
  }

  return map[ code.charAt(0) ];
}
