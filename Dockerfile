FROM ruby:2.7

COPY . /diyanfebri
WORKDIR /diyanfebri

RUN gem install bundler -v 2.4.22
RUN bundle install
# RUN bundle add webrick

# CMD bundle exec jekyll serve
EXPOSE 4000
