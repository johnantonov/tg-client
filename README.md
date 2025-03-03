docker build -t tg_parser .

docker run -it -v $(pwd)/session.txt:/app/session.txt tg_parser


<!-- docker run -v $(pwd)/session:/app/session tg_parser -->
