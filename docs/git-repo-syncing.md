# Git Repos Syncing

We need to sync github repos to the hosted repo on drupal.org as per the question below:

"Can github actions push repo commits to an external repository?
I will publish and release updates for dxpr_theme on drupal.org — but because github has better features I want to manage issues and PRs on github in a private repo. is it possible that all commits are pushed to the drupal.org repo?"


## How to enable syncing

- By default, the syncing is disabled.
- Set the github repo's secrets: "GIT_SYNC_ENABLED" to "true" to enable it.
- Generate a SSH key-pair to allow read access this github repo and write access to the repo on drupal.org as follows:

```bash
$ ssh-keygen -t rsa -b 4096 -C "dxpr_theme_sync@dxpr.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/hoatle/.ssh/id_rsa): ./dxpr_theme_sync_rsa
# Don't set passphrase            
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in ./dxpr_theme_sync_rsa.
Your public key has been saved in ./dxpr_theme_sync_rsa.pub.
The key fingerprint is:
SHA256:OqLKVqFmJOo6I3fa4s2kV8uDWh8e51+uIHeGqjipnAs dxpr_theme_sync@dxpr.com
The key's randomart image is:
+---[RSA 4096]----+
|                 |
|                 |
|                 |
|.. .             |
|+ . .   S        |
|.+ .  .. .       |
|E ..++*.= o .    |
|Bo*X+++X + o     |
|B%OB=.+...o..    |
+----[SHA256]-----+
```

Now you need to set the github's repo secrets: "SSH_PRIVATE_KEY" with the content of the file "dxpr_theme_sync_rsa".

- Set deploy keys with read access to this github repo with the content of the file "dxpr_theme_sync_rsa.pub"

- Set deploy keys with write access to the git repo on drupal.org with the content of the file "dxpr_theme_sync_rsa.pub"

- Make changes to the github repo and we should see the changes to be synced.

- Note that we're force pushing changes of branches and tags from the github repo to the repo on drupal.org
