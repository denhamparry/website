---
author: Lewis Denham-Parry
categories:
- nuget
- nuspec
- config
date: 2017-07-25T06:38:47Z
description: Nuget is a great packaging tool, but we can make it so much better!  We
  look into setting up a .nuspec file for our own classes and how to reference them.
draft: false
featured_image: /images/2017/07/nuget.png
slug: setting-up-nuget-for-packaging-and-consuming
tags:
- nuget
- nuspec
- config
title: Setting up Nuget for Packaging and Consuming
aliases:
    - "/setting-up-nuget-for-packaging-and-consuming/"
---

## Creating

A *.nuspec* file is an XML manifest that contains package metadata. This is used both to build the package and to provide information to consumers. The manifest is always included in a package.

### Create a .nuspec file

To create a new *.nuspec* file within a project, open a command line at the root of the project directory and enter the following command:

```command
nuget spec
```

If the project file is already setup, pass the project filename with the command to include some standard tokens:

```command
nuget spec MyProject.csproj
```

If the project has already been compiled, pass the .dll filename with the command:

```command
nuget spec MyAssembly.dll
```

This process may fail if the project file lacks values for the *.nuspec* elements.

### .nuspec.xsd file
A copy of the *nuspc.xsd* file can be found [here](https://github.com/NuGet/NuGet.Client/blob/dev/src/NuGet.Core/NuGet.Packaging/compiler/resources/nuspec.xsd).

### Required Metadata Elements

<table>
<tr>
<th>ELEMENT</th>
<th>DESCRIPTION</th>
</tr>
<tr>
<td>id</td>
<td>The case-insensitive package identifier, which must be unique across NuGets gallery or the gallery the package will reside in. IDs may not contain spaces or characters that are not valid for a URL, and generally follow .NET namespace rules.</td>
</tr>
<tr>
<td>version</td>
<td>The version of the package, following the major.minor.patch pattern. Version numbers may include a pre-release suffix.</td>
</tr>
<tr>
<td>description</td>
<td>A long description of the package for UI display.</td>
</tr>
<tr>
<td>authors</td>
<td>A comma-separated list of packages authors, matching the profile names on nuget.org. These are displayed in the NuGet Gallery on nuget.org and are used to cross-reference packages by the same authors.</td>
</tr>
</table>

### Optional Metadata Elements

<table>
<tr>
<th>ELEMENT</th>
<th>DESCRIPTION</th>
</tr>
<tr>
<td>title</td>
<td>A human-friendly title of the package, typically used in UI displays as on nuget.org and the Package Manager in Visual Studio. If not specified, the package ID is used instead.</td>
</tr>
<tr>
<td>Owners</td>
<td>A comma-separated list of the package creators using profile names on nuget.org. This is often the same list as in authors.</td>
</tr>
<tr>
<td>projectUrl</td>
<td>A URL for the package's home page, often shown in UI displays.</td>
</tr>
<tr>
<td>licenseUrl
<td>A URL for the package's license, often shown in UI displays.</td>
</tr>
<tr>
<td>iconUrl</td>
<td>A URL for a 64x64 image with transparency background to use as the icon for the package in UI display. Note: this should be the image URL and not a web page containing the image.</td>
</tr>
<tr>
<td>requireLicenseAcceptance</td>
<td>A Boolean value specifying whether the client must prompt the consumer to accept the package license before installing the package.</td>
</tr>
<tr>
<td>developmentDependency</td>
<td>(2.8+)  A Boolean value specifying whether the package will be marked as a development-only-dependency, which prevents the package from being included as a dependency in other packages.</td>
</tr>
<tr>
<td>summary</td>
<td>A short description of the package for UI display. If omitted, a truncated version of the description is used.</td>
</tr>
<tr>
<td>releaseNotes</td>
<td>(1.5+)  A description of the changes made in this release of the package, often used in UI like the Updates tab of the Visual Studio Package Manager in place of the package description.</td>
</tr>
<tr>
<td>copyright</td>
<td>(1.5+)  Copyright details for the package.</td>
</tr>
<tr>
<td>language</td>
<td>The locale ID for the package.</td>
</tr>
<tr>
<td>tags</td>
<td>A space-delimited list of tags and keywords that describe the package and aid discoverability of packages through search and filtering mechanisms.</td>
</tr>
<tr>
<td>serviceable</td>
<td>(3.3+)  For internal NuGet use only.</td>
</tr>
<tr>
<td>minClientVersion</td>
<td>(2.5+)  Specifies the minimum version of the NuGet client that can install this package, enforced by nuget.exe and the Visual Studio Package Manager. This is used whenever the package depends on specific features of the .nuspec file that were added in a particular version of the NuGet client. For example, a package using the developmentDependency attribute would specify "2.8" for minClientVersion. Similarly, a package using the contentFiles element (see the next section) would set minClientVersion to "3.3". Note also that because NuGet clients prior to 2.5 do not recognize this flag, they will always refuse to install the package no matter what value you use in minClientVersion.</td>
</tr>
</table>

### Collection Elements

<table>
<tr>
<th>ELEMENT</th>
<th>DESCRIPTION</th>
</tr>
<tr>
<td>packageTypes</td>
<td>(3.3+)  A collection of zero or more <packageType> elements specifying the type of the package if other than a traditional dependency package. Each packageType has attributes of name and version.</td>
</tr>
<tr>
<td>dependencies</td>
<td>A collection of zero or more <dependency> elements specifying the dependencies for the package. Each dependency has attributes of id, version, include (3.x+), and exclude (3.x+).</td>
</tr>
<tr>
<td>frameworkAssemblies</td>
<td>(1.2+)  A collection of zero or more <frameworkAssembly> elements identifying .NET Framework assembly references that this package requires, which ensures that references are added to projects consuming the package. Each frameworkAssembly has assemblyName and targetFramework attributes.</td>
</tr>
<tr>
<td>references</td>
<td>(1.5+)  A collection of zero or more <reference> elements naming assemblies in the package's lib folder that are added as project references. Each reference has a file attribute. <references> can also contain a <group> element with a targetFramework attribute, that then contains <reference> elements. If omitted, all references in lib are included.</td>
</tr>
<tr>
<td>contentFiles</td>
<td>(3.3+)  A collection of <files> elements that identify content files that should be include in the consuming project. These files are specified with a set of attributes that describe how they should be used within the project system.</td>
</tr>
</table>

### Version Definitions

The convention for version definitions is as follows:

**Major.Minor.Patch.**

<table>
<tr>
<td>Major</td>
<td>Breaking changes.</td>
</tr>
<tr>
<td>Minor</td>
<td>New features but backwards compatible.</td>
</tr>
<tr>
<td>Patch</td>
<td>Backwards compatible bug fixes only.</td>
</tr>
</table>

You can specify versions in two ways:
* **.nuspec file**: include the semantic version suffix in the version element:
<version>1.0.1-alpha</version>
* **Assembly attributes**: when building a package from a project use AssemblyInformationalVersionAttributeto specify this version:
[assembly: AssemblyInformationalVersion("1.0.1-beta")]

### Alpha / Beta / Release Candidate

When in development, the following tags can be added to the version definition:

<table>
<tr>
<td>alpha</td>
<td>Typically used for work-in-progress and experimentation.</td>
</tr>
<tr>
<td>beta</td>
<td>Typically one that is feature complete for the net planned release, but may contain known bugs.</td>
</tr>
<tr>
<td>rc</td>
<td>Typically a release that’s potentially final (stable) unless significant bugs emerge.</td>
</tr>
</table>

### Dependency Versions

You can specify dependencies for your package in the <dependencies> node of the *.nuspec* file, where each dependency is listed with a *<dependency>* tag:

```json
<dependencies>
  <dependency id="Newtonsoft.Json" version="9.0" />
  <dependency id="EntityFramework" version="6.1.0" />
</dependencies>
```

Dependencies are installed whenever the dependent package is installed, reinstalled, or included in a package restore. NuGet chooses the exact version of the installed dependency by using the value of the version attribute specified for that dependency as described in the following sections.

### Version ranges

<table>
<tr>
<th>Notation</th>
<th>Applied rule</th>
<th>Description</th>
</tr>
<tr>
<td>1.0</td>
<td>1.0 ≤ x</td>
<td>Minimum version, inclusive</td>
</tr>
<tr>
<td>(1.0,)</td>
<td>1.0 < x</td>
<td>Minimum version, exclusive</td>
</tr>
<tr>
<td>[1.0]</td>
<td>x == 1.0</td>
<td>Exact version match</td>
</tr>
<tr>
<td>(,1.0]</td>
<td>x ≤ 1.0</td>
<td>Maximum version, inclusive</td>
</tr>
<tr>
<td>(,1.0)</td>
<td>x < 1.0</td>
<td>Maximum version, exclusive</td>
</tr>
<tr>
<td>[1.0,2.0]</td>
<td>1.0 ≤ x ≤ 2.0</td>
<td>Exact range, inclusive</td>
</tr>
<tr>
<td>(1.0,2.0)</td>
<td>1.0 < x < 2.0</td>
<td>Exact range, exclusive</td>
</tr>
<tr>
<td>[1.0,2.0)</td>
<td>1.0 ≤ x < 2.0</td>
<td>Mixed inclusive minimum and exclusive maximum version</td>
</tr>
<tr>
<td>(1.0)</td>
<td>invalid</td>
<td>invalid</td>
</tr>
</table>

### Version Ranges Example

```json
<!-- Accepts any version 6.1 and above -->
<dependency id="ExamplePackage" version="6.1" />

<!-- Accepts any version above, but not include 4.1.3. This might be
      used to guarantee a dependency with a specific bug fix. -->
<dependency id="ExamplePackage" version="(4.1.3,)" />

<!-- Accepts any version up below 5.x, which might be used to prevent
      pulling in a later version of a dependency that changed its interface.
      However, this form is not recommended because it can be difficult to
      determine the lowest version.  -->
<dependency id="ExamplePackage" version="(,5.0)" />

<!-- Accepts any 1.x or 2.x version, but no 0.x or 3.x and higher versions -->
<dependency id="ExamplePackage" version="[1,3)" />

<!-- Accepts 1.3.2 up to 1.4.x, but not 1.5 and higher. -->
<dependency id="ExamplePackage" version="[1.3.2,1.5)" />
```

### Dependency Groups

As an alternative to a single flat list, dependencies can also be specified according to the framework profile of the target project using *<group>* elements within *<dependencies>*.
Each group has an attribute named targetFramework and contains zero or more *<dependency>* elements. Those dependencies will be installed together when the target framework is compatible with the project's framework profile.
The *<group>* element without a targetFramework attribute is used as the default or fallback list of dependencies.
Below is an example implementation of a dependency group:

```json
<dependencies>
  <group>
    <dependency id="RouteMagic" version="1.1.0" />
  </group>
  <group targetFramework="net40">
    <dependency id="jQuery" />
    <dependency id="WebActivator" />
  </group>
  <group targetFramework="sl30">
  </group>
</dependencies>
```

### Explicit Assembly References

The *<references>* element explicitly specifies the assemblies that the target project should reference when using the package. When this element is present, NuGet will add references to only the listed assemblies; it will not add references for any other assemblies in the package's lib folder.
For example, the following *<references>* element instructs NuGet to add references to only *xunit.dll* and *xunit.extensions.dll* even if there are additional assemblies in the package:

```json
<references>
  <reference file="xunit.dll" />
  <reference file="xunit.extensions.dll" />
</references>
```

### Reference Groups

As an alternative to a single flat list, references can also be specified according to the framework profile of the target project using *<group>* elements within *<references>*.
Each group has an attribute named targetFramework and contains zero or more *<reference>* elements. Those references will be added to a project when the target framework is compatible with the project's framework profile.
The *<group>* element without a targetFramework attribute is used as the default or fallback list of references.  For example:

```json
<references>
  <group>
    <reference file="a.dll" />
  </group>
  <group targetFramework="net45">
    <reference file="b45.dll" />
  </group>
  <group targetFramework="netcore45">
    <reference file="bcore45.dll" />
  </group>
</references>
```

### Framework Assembly References

Framework assemblies are those that are part of the .NET framework and should already be in the global assembly cache (GAC) for any given machine. By identifying those assemblies within the *<frameworkAssemblies>* element, a package can ensure that required references are added to a project in the event that the project doesn't have such references already. Such assemblies, of course, are not included in a package directly.
The *<frameworkAssemblies>* element contains zero or more *<frameworkAssembly>* elements, each of which specifies the following attributes:

<table>
<tr>
<th>Attribute</th>
<th>Description</th>
</tr>
<tr>
<td>assemblyName</td>
<td>(Required) The fully qualified assembly name.</td>
</tr>
<tr>
<td>targetFramework</td>
<td>(Optional) Specifies the target framework to which this reference applies. If omitted, indicates that the reference applies to all frameworks.</td>
</tr>
</table>

An example is below:

```xml
<frameworkAssemblies>
  <frameworkAssembly assemblyName="System.Net"  />
  <frameworkAssembly assemblyName="System.ServiceModel" targetFramework="net40" />
</frameworkAssemblies>
```

### Including Assembly Files

To bypass this automatic behaviour and explicitly control which files are included in a package, place a *<files>* element as a child of *<package>* (and a sibling of *<metadata>*), identifying each file with a separate *<file>* element. For example:

```xml
<files>
  <file src="bin\Debug\*.dll" target="lib" />
  <file src="bin\Debug\*.pdb" target="lib" />
  <file src="tools\**\*.*" exclude="**\*.log" />
</files>
```

### File Element Attributes

Each *<file>* element specifies the following attributes:

<table>
<tr>
<th>Attribute</th>
<th>Description</th>
</tr>
<tr>
<td>src</td>
<td>The location of the file or files to include, subject to exclusions specified by the exclude attribute. The path is relative to the .nuspec file unless an absolute path is specified. The wildcard character * is allowed, and the double wildcard ** implies a recursive folder search.</td>
</tr>
<tr>
<td>target</td>
<td>The relative path to the folder within the package where the source files will be placed, which must begin with lib, content, or tools.</td>
</tr>
<tr>
<td>exclude</td>
<td>A semicolon-delimited list of files or file patterns to exclude from the src location. The wildcard character * is allowed, and the double wildcard ** implies a recursive folder search.</td>
</tr>
</table>

### Content Files

By default, a package places content in a contentFiles folder (see below) and NuGet pack will include all files in that folder using default attributes. In this case it's not necessary to include a contentFiles node in the *.nuspec* at all.
To control which files are included, the *<contentFiles>* element specifies is a collection of *<files>* elements that identify the exact files include. These files are specified with a set of attributes that describe how they should be used within the project system:

<table>
<tr>
<th>Attribute</th>
<th>Description</th>
</tr>
<tr>
<td>include</td>
<td>(**Required**) The location of the file or files to include, subject to exclusions specified by the exclude attribute. The path is relative to the *.nuspec* file unless an absolute path is specified. The wildcard character * is allowed, and the double wildcard ** implies a recursive folder search.</td>
</tr>
<tr>
<td>exclude</td>
<td>A semicolon-delimited list of files or file patterns to exclude from the src location. The wildcard character * is allowed, and the double wildcard ** implies a recursive folder search.</td>
</tr>
<tr>
<td>buildAction</td>
<td>The build action to assign to the content item for MSBuild, such as Content, None, Embedded Resource, Compile, etc. The default is Compile.</td>
</tr>
<tr>
<td>copyToOutput</td>
<td>A Boolean indicating whether to copy content items to the build output folder. The default is false.</td>
</tr>
<tr>
<td>flatten</td>
<td>A Boolean indicating whether to copy content items to a single folder in the build output (true), or to preserve the folder structure in the package (false). The default is false.
When installing a package, NuGet applies the child elements of *<contentFiles>* from top to bottom. If multiple entries match the same file then all entries will be applied. The top-most entry will override the lower entries if there is a conflict for the same attribute.
</td>
</tr>
</table>

### Package Folder Structure

The package project should structure content using the following pattern:

```command
/contentFiles/{codeLanguage}/{TxM}/{any?}
```
* codeLanguages may be cs, vb, fs, any, or the lowercase equivalent of a given *$(ProjectLanguage)*
* TxM is any legal target framework moniker that NuGet supports.
* Any folder structure may be appended to the end of this syntax.

```xml
<contentFiles>
  <!-- Embed image resources -->
  <files include="any/any/images/dnf.png" buildAction="EmbeddedResource" />
  <files include="any/any/images/ui.png" buildAction="EmbeddedResource" />
  <!-- Embed all image resources under contentFiles/cs/ -->
  <files include="cs/**/*.png" buildAction="EmbeddedResource" />
  <!-- Copy config.xml to the root of the output folder -->
  <files include="cs/uap/config/config.xml" buildAction="None" copyToOutput="true" flatten="true" />
  <!-- Copy run.cmd to the output folder and keep the directory structure -->
  <files include="cs/commands/run.cmd" buildAction="None" copyToOutput="true" flatten="false" />
  <!-- Include everything in the scripts folder except exe files -->
  <files include="cs/net45/scripts/*" exclude="**/*.exe"  buildAction="None" copyToOutput="true" />
</contentFiles>
```

## Transforming Source Code and Configuration Files

For projects using packages.config or project.json, NuGet supports the ability to make transformations to source code and configuration files at package install and uninstall times.

A source code transformation applies one-way token replacement to files in the package's content folder when the package is installed, where tokens refer to Visual Studio project properties. This allows you to insert a file into the project's namespace, or to customize code that would typically go into global.asax in an ASP.NET project.

A config file transformation allows you to modify files that already exist in a target project, such as web.config and app.config. For example, your package might need to add an item to the modules section in the config file. This transformation is done by including special files in the package that describe the sections to add to the configuration files. When a package is uninstalled, those same changes are then reversed, making this a two-way transformation.

### Creating Localised NuGet Packages

There are two ways to create localized versions of a library:
1. Include all localized resources assemblies in a single package.
2. Create separate localized satellite packages (NuGet 1.8 and later), by following a strict set of conventions.

Both methods have their advantages and disadvantages.

### Example .nuspec file

```xml
<?xml version="1.0"?>
<package >
  <metadata>
    <id>DenhamParry.Framework.Core</id>
    <version>26.0.1-beta</version>
    <title>DenhamParry.Framework.Core</title>
    <authors>Lewis Denham-Parry</authors>
    <owners>Lewis Denham-Parry</owners>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <releaseNotes>Update DenhamParry logo</releaseNotes>
    <description>Core utility for DenhamParry websites</description>
    <copyright>Copyright ©2017</copyright>
    <tags>DenhamParry Framework Core</tags>
    <projectUrl>https://denhamparry.co.uk</projectUrl>
    <iconUrl>https://denhamparry.co.uk</images/nuget>
    <dependencies>
      <dependency id="Castle.WcfIntegrationFacility" version="3.3.0.0" />
      <dependency id="Castle.Core" version="3.3.0.0" />
      <dependency id="Castle.Windsor" version="3.3.0.0" />
      <dependency id="log4net" version="1.2.10.0" />
      <dependency id="Microsoft.IdentityModel" version="6.1.7600.16394" />
    </dependencies>
    <references>
      <reference file="Enyim.Caching.dll" />
    </references>
  </metadata>
  <files>
    <file src="..\..\..\..\Library\Enyim.Caching.dll" target="lib\net35"/>
    <file src="readme.txt"/>
  </files>
</package>
```

### Packaging
When using an assembly or the convention-based working directory, create a package by running NuGet pack with your .nuspecfule:

```command
nuget pack <your_project>.nuspec
```

You can also pass the project file name which will automatically load the project’s .nuspec file and replace any tokens within it using the project file:

```command
nuget pack <your_project>.csproj
```


### Referenced Projects
If the project references other projects, you can add the referenced projects as part of the package, or as dependencies using the *–IncludeReferencedProjects* option:

```command
nuget pack MyProject.csproj –
IncludeReferencedProjects
```

This inclusion process is recursive, so if *MyProject.csproj* references projects B and C, and those projects reference D, E, and F, then files from B, C, D, E, and F will be included in the package.

If a referenced project includes a *.nuspec* file of its own, then NuGet adds that referenced project as a dependency instead. You will need to package and publish that project separately.

### Build Configuration

By default, NuGet will use the default build configuration set in the project file, typically Debug. To pack files from a different build configuration, such as Release, use the *-properties* option with the configuration:

```command
nuget pack MyProject.csproj -properties Configuration=Release
```

### Symbols
To include symbols that allow consumers to step through the packaged code in the debugger, us the *–Symbols* option:

```command
nuget pack MyProject.csproj -symbols
```

### Replacement Tokens

When creating a package, the NuGet pack command replace a $-delimited tokens in the *.nuspec* files *<metadata>* node with the values that come from either a project file or the pack commands -properties switch.  For example:

``` command
nuget pack -properties <name>=<value>;<name>=<value>
```

### Unzip a Package

The *.nupkg* file is essentially a .zip file, so if you require to browse the contents of the file either use a compression managing program to view/extract the files or rename the extension from .nupkg to .zip.

## Publishing

The local publish directory is found at the root of the branch folder.  The folder is named Nuget and contains nuget.exe file as well as any other local published packages.

### Consuming

To consume the package it is expected that you’ll be suing Visual Studio 2105.

### NuGet.Config

NuGet behavior is controlled by settings in NuGet.Config files.

###Config Section

Contains miscellaneous configuration settings.

<table>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
<tr>
<td>dependencyVersion (package.config only)</td>
<td>The default DependencyVersion value for package install, restore, and update, when the -DependencyVersion switch is not specified directly. This value is also used by the NuGet Package Manager UI. Values are Lowest, HighestPatch, HighestMinor, Highest.</td>
</tr>
<tr>
<td>globalPackagesFolder (projects not using packages.config)</td>
<td>The location of the default global packages folder. The default is %userprofile%\.nuget\packages. A relative path can be used in project-specific Nuget.Config files.</td>
</tr>
<tr>
<td>repositoryPath (packages.config only)</td>
<td>The location in which to install NuGet packages instead of the default $(Solutiondir)\packages folder. A relative path can be used in project-specific Nuget.Config files.</td>
</tr>
<tr>
<td>defaultPushSource</td>
<td>Identifies the URL or path of the package source that should be used as the default if no other package sources are found for an operation.</td>
</tr>
<tr>
<td>http_proxy http_proxy.user http_proxy.password no_proxy</td>
<td>Proxy settings to use when connecting to package sources; http_proxy should be in the format http://<username>:<password>@<domain>. Passwords are encrypted and cannot be added manually. For no_proxy, the value is a comma-separated list of domains the bypass the proxy server. You can alternately use the http_proxy and no_proxy environment variables for those values.</td>
</tr>
</table>

### bindingRedirects Section

Configures whether NuGet does automatic binding redirects when a package is installed.

<table>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
<tr>
<td>skip</td>
<td>A Boolean indicating whether to skip automatic binding redirects. The default is false.</td>
</tr>
</table>

### packageRestore Section

Controls package restore during builds.

<table>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
<tr>
<td>enabled</td>
<td>A Boolean indicating whether NuGet can perform automatic restore. You can also set the EnableNuGetPackageRestore environment variable with a value of True instead of setting this key in the config file.</td>
</tr>
<tr>
<td>automatic</td>
<td>A Boolean indicating whether NuGet should check for missing packages during a build.</td>
</tr>
</table>

### solution Section

Controls whether the packages folder of a solution is included in source control.

<table>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
<tr>
<td>disableSourceControlIntegration</td>
<td>A Boolean indicating whether to ignore the packages folder when working with source control. The default value is false.</td>
</tr>
</table>

### packageSources

The packageSources, packageSourceCredentials, apikeys, activePackageSource, and disabledPackageSources all work together to configure how NuGet works with package repositories during install, restore, and update operations.

<table>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
<td>(name to assign to the package source)</td>
<td>The path or URL of the package source.</td>
</tr>
</table>

###Example nuget.config file

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <config>
    <add key="dependencyVersion" value="Highest" />
    <add key="globalPackagesFolder" value="..\packages" />
    <add key="repositoryPath" value="..\packages" />
  </config>
  <packageRestore>
    <add key="enabled" value="True" />
    <add key="automatic" value="True" />
  </packageRestore>
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" />
    <add key="Local Dev" value="D:\Dev\Nuget\Nuget\" />
  </packageSources>
  <activePackageSource>
    <add key="All" value="(Aggregate source)" />
  </activePackageSource>
</configuration>
```

### Symbols Server

You can use a symbol server to allow Visual Studio to automatically download the correct symbols for debugging your Visual Studio project.

* For VS 2015, go to Tools menu and click Options.
* Within the Options dialog box, open the Debugging node and then click Symbols.
* Click the New Folder icon and add the location for the symbols server.

## References
* [NuGet documentation](https://docs.microsoft.com/en-us/nuget/)
* [.nuspec reference](https://docs.microsoft.com/en-us/nuget/schema/nuspec)
* [Creating a package](https://docs.microsoft.com/en-us/nuget/create-packages/creating-a-package)
* [Creating a symbol packages](https://docs.microsoft.com/en-us/nuget/create-packages/symbol-packages)
* [Target frameworks](https://docs.microsoft.com/en-us/nuget/schema/target-frameworks)
* [Local feeds](https://docs.microsoft.com/en-us/nuget/hosting-packages/local-feeds)
* [Create and deploy a NuGet server](https://docs.microsoft.com/en-us/nuget/hosting-packages/nuget-server)
* [Pre-release versions](https://docs.microsoft.com/en-us/nuget/create-packages/prerelease-packages)
* [Transforming source code and configuration files](https://docs.microsoft.com/en-us/nuget/create-packages/source-and-config-file-transformations)
* [ProjectProperty properties](https://msdn.microsoft.com/library/vslangproj.projectproperties_properties.aspx)
* [Creating localised NuGet packages](https://docs.microsoft.com/en-us/nuget/create-packages/creating-localized-packages)
* [Creating symbol packages](https://docs.microsoft.com/en-us/nuget/create-packages/symbol-packages)
* [Publishing packages](https://docs.microsoft.com/en-us/nuget/create-packages/publish-a-package)
* [NuGet.Config reference](https://docs.microsoft.com/en-us/nuget/schema/nuget-config-file)
* [How To: Use a Symbol Server](https://msdn.microsoft.com/en-gb/library/b8ttk8zy(v=vs.90).aspx)
