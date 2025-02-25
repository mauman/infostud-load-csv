Enters verbalization data into the Sapienza Infostud crappy system, saving your time and mental health.
Just add it through Tampermonkey, then select "Browse" and "Load CSV" in the UI.
The csv format is the following:

`matriculation, name, surname, email, grade (R = rinuncia, B = bocciato, L = 30 e lode, A = assente [optional]), date (DD/MM/YYYY) [optional]`

Note the order of `matriculation, name, surname, email, ` follows the **export of the spreadsheet from Infostud** so you can use that to 
create the initial CSV.

so create a CSV file as:

| Matriculation | Name  | Surname | Email                     | Grade | Date       |
|---------------|-------|---------|---------------------------|-------|------------|
| 12345         | John  | Doe     | john.doe@example.com      | A     | 10/02/2024 |
| 67890         | Jane  | Smith   | jane.smith@example.com    | R     | 05/02/2024 |
| 24680         | Alice | Johnson | alice.johnson@example.com | B     | 08/02/2024 |
| 13579         | Bob   | Brown   | bob.brown@example.com     | 28    |            |
| 246810        | Joe   | Fish    | joe.fish@example.com      | 30+L  |            |
| 2310109       | Ann   | Harbor  | ann.harbor@example.com    | L     |            |

**NOTE:** you can select if students missing in the file should be ignored (default) or marked "A"bsent

Enjoy!
