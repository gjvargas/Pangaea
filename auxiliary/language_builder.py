import math
file_in = open('./auxiliary/languages.txt', 'r')
file_out = open('./auxiliary/language_html_blob.html','w')

file_out.write('<select>\n')

counter = 1;
for line in file_in:
  if counter > 0:
    file_out.write('\t<option value=\"')
    file_out.write(line.strip()) #split()[0] is hack to remove whitespace at end, d
  else:
    file_out.write('\">')
    file_out.write(line.strip()) #don't feel like looking up regex in python
    file_out.write('</option>\n')
  counter = counter * -1

file_out.write('</select>')


file_in.close()
file_out.close()
