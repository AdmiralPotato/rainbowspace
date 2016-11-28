#!/usr/bin/env bash
read -p "Are you SURE you want to delete your remote gh-pages branch and replace it with a fresh one? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
	git -c core.quotepath=false push --progress --porcelain origin :gh-pages
	git subtree push --prefix public origin gh-pages
fi
