import math
file_in = open('./auxiliary/languages.txt', 'r')
file_out = open('./auxiliary/language_html_blob.html','w')

file_out.write('<select>\n')

counter = 1;
# file has each language on two lines
for line in file_in:
  if counter > 0:
    file_out.write('\t<option value=\"')
    file_out.write(line.strip()) # these are two letter codes
  else:
    file_out.write('\">')
    file_out.write(line.strip()) # these are full language strings
    file_out.write('</option>\n')
  counter = counter * -1

file_out.write('</select>')


file_in.close()
file_out.close()
