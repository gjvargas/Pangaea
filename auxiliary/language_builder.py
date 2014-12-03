import math
file_in = open('./auxiliary/languages.txt', 'r')
file_out = open('./auxiliary/language_html_blob.html','w')

file_out.write('{\n')

counter = 1;
# file has each language on two lines
language = ''
for line in file_in:
  if counter > 0:
    language = line.strip() + '\",'
  else:
    language = '\t\"' + line.strip().lower() + '\" : \"' + language
    file_out.write(language + "\n")
    language = "";
  counter = counter * -1

file_out.write('</select>')


file_in.close()
file_out.close()
