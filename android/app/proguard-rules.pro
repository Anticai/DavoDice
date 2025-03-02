# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native ProGuard Rules

# Keep our interfaces so they can be used by other ProGuard rules
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# For Okio
-dontwarn org.codehaus.mojo.animal_sniffer.*

# For OkHttp
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# JSR 305 annotations are for embedding nullability information
-dontwarn javax.annotation.**

# For React Native's JavaScript engine. We need to keep everything in hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Reanimated rules
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Keep SVG classes
-keep public class com.horcrux.svg.** {*;}

# Keep custom app classes
-keep class com.bloodbowldicecalculator.** { *; }

# Reduce APK size by removing unneeded Android support libs
-dontwarn androidx.appcompat.**
-dontwarn androidx.fragment.app.**

# Keep JavaScript names when debugging
-keepattributes SourceFile,LineNumberTable

# Add any additional rules specific to your app here
