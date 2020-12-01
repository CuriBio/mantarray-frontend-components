set -ex

# In Cloud9, everytime the EC2 reboots, it seems like you need to explicitly set nano as the editor in order to allow interactive rebasing to work
git config --global core.editor "nano"