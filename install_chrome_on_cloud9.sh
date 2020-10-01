# script to install things on Cloud9
# Based off of the AWS CodeBuild Dockerfile: https://github.com/aws/aws-codebuild-docker-images/blob/master/ubuntu/standard/3.0/Dockerfile

set -ex

# Install Chrome

curl --silent --show-error --location --fail --retry 3 --output /tmp/google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
(sudo dpkg -i /tmp/google-chrome-stable_current_amd64.deb || sudo apt-get -fy install)

rm -rf /tmp/google-chrome-stable_current_amd64.deb

sudo sed -i 's|HERE/chrome"|HERE/chrome" --disable-setuid-sandbox --no-sandbox|g' "/opt/google/chrome/google-chrome"
google-chrome --version

