# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

-dontwarn me.pushy.**
-keep class me.pushy.** { *; }
-keep class androidx.core.app.** { *; }
-keep class android.support.v4.app.** { *; }
# Keep your custom notification service extension

# Keep OneSignal classes and interfaces

# Keep annotations used by OneSignal
-keepattributes *Annotation*

# Prevent minifying service extension classes/interfaces

# (Optional) If you're using lambda expressions in your service
-dontwarn java.lang.invoke.*
